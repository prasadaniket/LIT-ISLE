import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { booksData } from "./data";
import { ChevronLeft, ChevronRight, Share2, Bookmark, Type, X } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker&url";
import { useShelf } from "../../contexts/ShelfContext";

const pdfMeta = {
  "thirty-nine-steps": { totalPages: 140, pdf: "/Books/pdf/The Thirty-Nine Steps (Richard Hannay, #1).pdf" },
  "mountains-of-madness": { totalPages: 110, pdf: "/Books/pdf/At the Mountains of Madness.pdf" },
  "vindication-of-rights-of-woman": { totalPages: 180, pdf: "/Books/pdf/A_Vindication_of_the_Rights_of_Women.pdf" },
  "art-of-war": { totalPages: 80, pdf: "/Books/pdf/Art_of_War.pdf" },
  walden: { totalPages: 200, pdf: "/Books/pdf/Walden.pdf" },
  "origin-of-species": { totalPages: 220, pdf: "/Books/pdf/On the Origin of Species and Other Stories.pdf" },
  "shakespeare-works-vol1": { totalPages: 400, pdf: "/Books/pdf/The Complete Works of William Shakespeare, Volume 1 of 2.pdf" },
  "alice-in-wonderland": { totalPages: 300, pdf: "/Books/pdf/Alice’s Adventures in Wonderland and Other Tales.pdf" },
  "sherlock-holmes": { totalPages: 250, pdf: "/Books/pdf/The Adventures of Sherlock Holmes.pdf" },
  "the-great-gatsby": { totalPages: 180, pdf: "/Books/pdf/The Great Gatsby.pdf" },
  "moby-dick": { totalPages: 500, pdf: "/Books/pdf/Moby Dick.pdf" },
  dracula: { totalPages: 300, pdf: "/Books/pdf/Dracula.pdf" },
  frankenstein: { totalPages: 280, pdf: "/Books/pdf/Frankenstein.pdf" },
};

const BookReader = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToShelf, updateProgress } = useShelf();

  const book = useMemo(() => booksData[slug], [slug]);
  const meta = pdfMeta[slug];
  const pdfUrl = meta?.pdf;
  const [totalPages, setTotalPages] = useState(meta?.totalPages || 0);

  const [page, setPage] = useState(1);
  const [turning, setTurning] = useState(false);
  const [turnDir, setTurnDir] = useState(null); // 'next' | 'prev'
  const TURN_DURATION_MS = 650;
  const [flip, setFlip] = useState({ active: false, side: null, src: null }); // side: 'left' | 'right'
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const surfaceRef = useRef(null);
  const pdfRef = useRef(null);
  const [coverOpen, setCoverOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontScale, setFontScale] = useState(100);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!book || !pdfUrl) return;
    // Ensure it appears in currently reading
    addToShelf({ slug, title: book.title, author: book.author, cover: book.cover, progress: 0 }, "currentlyReading");
  }, [book, pdfUrl, slug, addToShelf]);

  useEffect(() => {
    const percent = Math.max(0, Math.min(100, Math.round((page / totalPages) * 100)));
    updateProgress(slug, percent);
  }, [page, totalPages, slug, updateProgress]);

  // Load bookmarks per book
  useEffect(() => {
    const raw = localStorage.getItem(`lit-isle-bookmarks-${slug}`);
    setBookmarks(raw ? JSON.parse(raw) : []);
  }, [slug]);

  useEffect(() => {
    localStorage.setItem(`lit-isle-bookmarks-${slug}`, JSON.stringify(bookmarks));
  }, [slug, bookmarks]);

  // Auto play cover flip
  useEffect(() => {
    const t = setTimeout(() => setCoverOpen(true), 500);
    return () => clearTimeout(t);
  }, []);

  // Initialize pdf.js and render current spread
  useEffect(() => {
    if (!pdfUrl) return;
    // Configure worker once
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    let cancelled = false;
    (async () => {
      try {
        // Encode each path segment to avoid special-char issues (#, spaces, unicode quotes)
        const buildSafeUrl = (raw) => {
          try {
            if (!raw) return raw;
            const parts = raw.split('/');
            const encoded = parts.map((seg, idx) => idx === 0 && seg === '' ? '' : encodeURIComponent(seg));
            return encoded.join('/');
          } catch { return raw; }
        };
        const safePath = buildSafeUrl(pdfUrl); // still relative from public root
        const absoluteUrl = new URL(safePath, window.location.origin).toString().replace(/#/g, '%23');

        const res = await fetch(absoluteUrl, { mode: 'same-origin', cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = await res.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: buffer });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);
        await renderSpread(page);
      } catch (err) {
        console.error('Failed to load PDF:', err);
        // Fallback: try direct URL in case fetch altered bytes
        try {
          const urlFallback = new URL(pdfUrl, window.location.origin).toString().replace(/#/g, '%23');
          const loadingTask2 = pdfjsLib.getDocument({ url: urlFallback, withCredentials: false });
          const pdf2 = await loadingTask2.promise;
          if (cancelled) return;
          pdfRef.current = pdf2;
          setTotalPages(pdf2.numPages);
          await renderSpread(page);
        } catch (e2) {
          console.error('Fallback URL load also failed:', e2);
        }
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  // Re-render spread on page, size, theme, or font changes
  useEffect(() => {
    (async () => {
      if (!pdfRef.current) return;
      await renderSpread(page);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, darkMode, fontScale]);

  // Handle resizing
  useEffect(() => {
    const onResize = () => renderSpread(page);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const getScaleForWidth = (viewport) => {
    const surface = surfaceRef.current;
    if (!surface) return 1;
    const padding = 32; // inner padding
    const gutter = 24; // space between pages
    const availableWidth = surface.clientWidth - padding * 2 - gutter;
    const singlePageWidth = availableWidth / 2;
    return singlePageWidth / viewport.width * (fontScale / 100);
  };

  const clearCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const renderPageToCanvas = async (pageNum, canvas) => {
    if (!pdfRef.current || !canvas) return;
    if (pageNum < 1 || pageNum > pdfRef.current.numPages) {
      clearCanvas(canvas);
      return;
    }
    const pdfPage = await pdfRef.current.getPage(pageNum);
    const viewport0 = pdfPage.getViewport({ scale: 1 });
    const scale = getScaleForWidth(viewport0);
    const viewport = pdfPage.getViewport({ scale });
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const renderContext = { canvasContext: context, viewport };
    await pdfPage.render(renderContext).promise;
  };

  const renderSpread = async (leftPageNum) => {
    setTurning(false);
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    await renderPageToCanvas(leftPageNum, leftCanvas);
    await renderPageToCanvas(leftPageNum + 1, rightCanvas);
  };

  if (!book || !pdfUrl) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="h-16" />
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-2xl font-bold">Reader unavailable</h1>
          <p className="mt-2 text-gray-600">We couldn't find a PDF for this book.</p>
          <button onClick={() => navigate(-1)} className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Go back</button>
        </div>
      </div>
    );
  }

  const go = (dir) => {
    if (turning) return; // debounce while animating
    setTurnDir(dir);
    setTurning(true);

    // Create a flip overlay image from the current visible page
    const srcCanvas = dir === 'next' ? rightCanvasRef.current : leftCanvasRef.current;
    try {
      const data = srcCanvas?.toDataURL('image/png');
      setFlip({ active: true, side: dir === 'next' ? 'right' : 'left', src: data });
      // Start flip on next frame to allow CSS transition
      requestAnimationFrame(() => {
        const el = document.getElementById('page-flip-img');
        if (el) {
          // force reflow
          void el.offsetWidth;
          el.classList.add('flip-run');
        }
      });
    } catch {}

    // change page near the end of flip
    setTimeout(() => {
      setPage((p) => {
        const next = dir === "next" ? Math.min(totalPages, p + 1) : Math.max(1, p - 1);
        return next;
      });
    }, Math.round(TURN_DURATION_MS * 0.8));

    setTimeout(() => {
      setFlip({ active: false, side: null, src: null });
      setTurning(false);
      setTurnDir(null);
    }, TURN_DURATION_MS);
  };

  const viewerSrc = undefined;

  const isBookmarked = bookmarks.includes(page);
  const toggleBookmark = () => {
    setBookmarks((bms) => (bms.includes(page) ? bms.filter(p => p !== page) : [...bms, page]));
  };

  // Simple swipe handlers for mobile
  const touchStartX = useRef(0);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) go("next"); else go("prev");
    }
  };

  return (
    <div className={`${darkMode ? "bg-[#0e1210] text-gray-100" : "bg-white text-gray-900"} min-h-screen`}>
      <div className="h-16" />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Link to={`/book/${slug}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
              ← Back to Library
            </Link>
          </div>
          <div className="text-sm font-medium" style={{ color: darkMode ? "#E6E8E6" : "#222" }}>{book.title}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNotes(true)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Add note">
              ✎
            </button>
            <button onClick={toggleBookmark} className={`p-2 rounded-md border ${isBookmarked ? "bg-[#0B6B4D] text-white border-[#0B6B4D]" : "border-gray-200 hover:bg-gray-50"}`} title="Bookmark">
              <Bookmark className="w-4 h-4" />
            </button>
            <button onClick={() => setFontScale(s => Math.max(80, Math.min(140, s + 10)))} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Increase font">
              <Type className="w-4 h-4" />
            </button>
            <button onClick={() => setDarkMode(v => !v)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Toggle theme">
              {darkMode ? "☾" : "☀"}
            </button>
            <button onClick={() => navigator.share?.({ title: book.title, url: window.location.href })} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Share">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => navigate(-1)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Book Surface */}
        <div
          ref={surfaceRef}
          className={`relative mx-auto max-w-5xl rounded-[18px] ${darkMode ? "bg-[#0f1411]" : "bg-[#f8f8f5]"} border border-gray-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] overflow-hidden`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Cover Flip */}
          <div
            className={`absolute inset-0 z-20 pointer-events-none origin-left transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${coverOpen ? "[transform:perspective(1200px)_rotateY(-150deg)] opacity-0" : "opacity-100"}`}
            style={{ backgroundImage: `url(${book.cover})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />

          {/* Page curl overlay on turn */}
          <div className={`absolute inset-0 z-10 pointer-events-none transition-transform duration-500 origin-left ${turning ? "[transform:perspective(1200px)_rotateY(-18deg)]" : ""}`} />

          {/* Two-page canvas spread */}
          <div className={`flex items-stretch justify-center gap-6 ${darkMode ? "bg-[#0f1411]" : "bg-[#f8f8f5]"} p-4 select-none`}>
            <div className={`rounded-md overflow-hidden bg-white shadow-inner relative [transform-style:preserve-3d] transition-transform ease-[cubic-bezier(.2,.8,.2,1)] duration-[650ms] will-change-transform ${turning && turnDir==='prev' ? '[transform:perspective(1400px)_rotateY(32deg)_translateX(4px)] origin-right shadow-2xl' : ''}`}>
              {turning && turnDir==='prev' && (<div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent" />)}
              <canvas ref={leftCanvasRef} className="block" />
            </div>
            <div className={`rounded-md overflow-hidden bg-white shadow-inner relative [transform-style:preserve-3d] transition-transform ease-[cubic-bezier(.2,.8,.2,1)] duration-[650ms] will-change-transform ${turning && turnDir==='next' ? '[transform:perspective(1400px)_rotateY(-32deg)_translateX(-4px)] origin-left shadow-2xl' : ''}`}>
              {turning && turnDir==='next' && (<div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />)}
              <canvas ref={rightCanvasRef} className="block" />
            </div>
          </div>

          {/* Flip overlay: real page image rotates over hinge */}
          {flip.active && (
            <div className="pointer-events-none absolute inset-0 flex items-stretch justify-center gap-6 p-4">
              {flip.side === 'left' ? (
                <div className="relative rounded-md overflow-hidden" style={{ width: leftCanvasRef.current?.width || 0, height: leftCanvasRef.current?.height || 0 }}>
                  <img id="page-flip-img" src={flip.src} alt="flip" className="absolute inset-0 w-full h-full object-cover origin-right transition-transform duration-[650ms] ease-[cubic-bezier(.2,.8,.2,1)] [transform:perspective(1400px)_rotateY(0deg)]" style={{ boxShadow: '0 12px 30px rgba(0,0,0,0.25)' }} />
                  <style>{`.flip-run{transform:perspective(1400px) rotateY( -160deg );}`}</style>
                </div>
              ) : (
                <div className="relative rounded-md overflow-hidden ml-auto" style={{ width: rightCanvasRef.current?.width || 0, height: rightCanvasRef.current?.height || 0 }}>
                  <img id="page-flip-img" src={flip.src} alt="flip" className="absolute inset-0 w-full h-full object-cover origin-left transition-transform duration-[650ms] ease-[cubic-bezier(.2,.8,.2,1)] [transform:perspective(1400px)_rotateY(0deg)]" style={{ boxShadow: '0 12px 30px rgba(0,0,0,0.25)' }} />
                  <style>{`.flip-run{transform:perspective(1400px) rotateY( 160deg );}`}</style>
                </div>
              )}
            </div>
          )}

          {/* Side Arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center p-3">
            <button onClick={() => go("prev")} className="p-2 rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white" aria-label="Previous page">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center p-3">
            <button onClick={() => go("next")} className="p-2 rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white" aria-label="Next page">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom progress & slider */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <div>Page {page} of {totalPages} ({Math.round((page/totalPages)*100)}%)</div>
          </div>
          <input
            type="range"
            min={1}
            max={Math.max(1, totalPages)}
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value, 10))}
            className="w-full accent-[#0B6B4D]"
          />
        </div>
      </div>

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800">Add note (page {page})</div>
              <button onClick={() => setShowNotes(false)} className="p-1 rounded-md border border-gray-200 hover:bg-gray-50"><X className="w-4 h-4" /></button>
            </div>
            <textarea value={noteText} onChange={(e)=>setNoteText(e.target.value)} rows={5} className="w-full border border-gray-200 rounded-md p-2 text-sm" placeholder="Type your highlight note here..." />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button onClick={() => setShowNotes(false)} className="px-3 py-1.5 rounded-md border border-gray-200">Cancel</button>
              <button onClick={() => { const raw = localStorage.getItem(`lit-isle-notes-${slug}`); const arr = raw ? JSON.parse(raw) : []; arr.push({ page, text: noteText, at: Date.now() }); localStorage.setItem(`lit-isle-notes-${slug}`, JSON.stringify(arr)); setNoteText(""); setShowNotes(false); }} className="px-3 py-1.5 rounded-md bg-[#0B6B4D] text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReader;


