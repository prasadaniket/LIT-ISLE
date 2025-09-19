import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { booksData } from "./data";
import { ChevronLeft, ChevronRight, Share2, Bookmark, Type, X } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker&url";
import { useShelf } from "../../contexts/ShelfContext";

// Configure PDF.js globally to handle WASM issues
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Set up fallback for image decoding issues
if (typeof window !== 'undefined') {
  // Disable WASM-based image decoding to avoid OpenJPEG issues
  pdfjsLib.GlobalWorkerOptions.workerPort = null;
}

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
  // Force light mode for reader
  const [fontScale, setFontScale] = useState(100);
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Track mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Mobile-specific initialization
  useEffect(() => {
    if (isMobile && pdfRef.current) {
      // Force re-render on mobile after a short delay
      const timer = setTimeout(() => {
        renderPages();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pdfRef.current, page, isMobile]);

  // Handle device orientation changes on mobile
  useEffect(() => {
    const handleOrientationChange = () => {
      if (isMobile && pdfRef.current) {
        setTimeout(() => {
          renderPages();
        }, 500);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [pdfRef.current, isMobile]);

  // Initialize pdf.js and render current spread
  useEffect(() => {
    if (!pdfUrl) return;
    
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
        
        // Configure PDF.js with proper WASM settings and fallbacks
        const loadingTask = pdfjsLib.getDocument({ 
          data: buffer,
          // Disable WASM for better compatibility
          disableWebGL: true,
          disableFontFace: false,
          // Enable fallback for image decoding
          disableAutoFetch: false,
          disableStream: false,
          // Configure worker options
          workerSrc: pdfWorker,
          // Disable WASM to avoid OpenJPEG issues
          useSystemFonts: true,
          // Fallback for image decoding
          disableCreateObjectURL: false
        });
        
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);
        await renderPages();
      } catch (err) {
        console.error('Failed to load PDF:', err);
        // Fallback: try direct URL in case fetch altered bytes
        try {
          const urlFallback = new URL(pdfUrl, window.location.origin).toString().replace(/#/g, '%23');
          const loadingTask2 = pdfjsLib.getDocument({ 
            url: urlFallback, 
            withCredentials: false,
            // Same configuration as primary load
            disableWebGL: true,
            disableFontFace: false,
            disableAutoFetch: false,
            disableStream: false,
            workerSrc: pdfWorker,
            useSystemFonts: true,
            disableCreateObjectURL: false
          });
          const pdf2 = await loadingTask2.promise;
          if (cancelled) return;
          pdfRef.current = pdf2;
          setTotalPages(pdf2.numPages);
          await renderPages();
        } catch (e2) {
          console.error('Fallback URL load also failed:', e2);
        }
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  // Re-render pages on page, size, theme, or font changes
  useEffect(() => {
    (async () => {
      if (!pdfRef.current) return;
      console.log('Rendering pages for page:', page, 'Mobile:', isMobile);
      await renderPages();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, fontScale, isMobile]);

  // Handle resizing
  useEffect(() => {
    const onResize = () => {
      // Add a small delay to ensure the resize is complete
      setTimeout(() => {
        renderPages();
      }, 100);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Cleanup render tasks on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending render tasks when component unmounts
      if (renderState.current.currentRenderTask.left) {
        renderState.current.currentRenderTask.left.cancel();
      }
      if (renderState.current.currentRenderTask.right) {
        renderState.current.currentRenderTask.right.cancel();
      }
      // Clear pending pages
      renderState.current.pendingPage.left = null;
      renderState.current.pendingPage.right = null;
    };
  }, []);

  const getScaleForWidth = (viewport) => {
    const surface = surfaceRef.current;
    if (!surface) return 1;
    
    if (isMobile) {
      // Mobile: use full width minus padding
      const padding = 24; // mobile padding
      const availableWidth = surface.clientWidth - padding * 2;
      return availableWidth / viewport.width * (fontScale / 100);
    } else {
      // Desktop: use half width for each page
      const padding = 32; // inner padding
      const gutter = 24; // space between pages
      const availableWidth = surface.clientWidth - padding * 2 - gutter;
      const singlePageWidth = availableWidth / 2;
      return singlePageWidth / viewport.width * (fontScale / 100);
    }
  };

  const clearCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Enhanced PDF rendering with queue management
  // This prevents the "Cannot use the same canvas during multiple render() operations" error
  // Features:
  // - isRendering flag prevents overlapping renders
  // - pendingPage queues new requests while rendering
  // - currentRenderTask.cancel() ensures old renders are cancelled
  // - Supports fast page flipping without crashes
  const renderState = useRef({
    isRendering: { left: false, right: false },
    pendingPage: { left: null, right: null },
    currentRenderTask: { left: null, right: null }
  });

  const renderPageToCanvas = async (pageNum, canvas, canvasType = 'left') => {
    if (!pdfRef.current || !canvas) {
      console.log('Missing PDF or canvas:', { pdfRef: !!pdfRef.current, canvas: !!canvas, pageNum, canvasType });
      return;
    }
    if (pageNum < 1 || pageNum > pdfRef.current.numPages) {
      console.log('Page out of range:', { pageNum, totalPages: pdfRef.current.numPages, canvasType });
      clearCanvas(canvas);
      return;
    }
    
    console.log('Rendering page to canvas:', { pageNum, canvasType, canvasWidth: canvas.width, canvasHeight: canvas.height });

    // If already rendering, queue the request
    if (renderState.current.isRendering[canvasType]) {
      renderState.current.pendingPage[canvasType] = pageNum;
      return;
    }

    // Set rendering flag
    renderState.current.isRendering[canvasType] = true;

    try {
      // Cancel any previous render task for this canvas
      if (renderState.current.currentRenderTask[canvasType]) {
        renderState.current.currentRenderTask[canvasType].cancel();
        renderState.current.currentRenderTask[canvasType] = null;
      }

      const pdfPage = await pdfRef.current.getPage(pageNum);
      const viewport0 = pdfPage.getViewport({ scale: 1 });
      const scale = getScaleForWidth(viewport0);
      const viewport = pdfPage.getViewport({ scale });
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Ensure canvas has proper dimensions on mobile
      if (isMobile) {
        const container = canvas.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          if (containerWidth > 0 && containerHeight > 0) {
            canvas.style.width = `${containerWidth}px`;
            canvas.style.height = `${containerHeight}px`;
          }
        }
      }
      
      // Enhanced render context with error handling
      const renderContext = { 
        canvasContext: context, 
        viewport,
        // Add fallback options for image decoding
        intent: 'display',
        renderInteractiveForms: false,
        // Disable problematic features that cause WASM issues
        enableWebGL: false
      };
      
      // Start new render task and store reference
      const renderTask = pdfPage.render(renderContext);
      renderState.current.currentRenderTask[canvasType] = renderTask;
      
      await renderTask.promise;
      
    } catch (error) {
      // Enhanced error handling for image decoding issues
      if (error.name === 'RenderingCancelledException') {
        // Ignore cancellation errors
        return;
      } else if (error.message && error.message.includes('OpenJPEG')) {
        console.warn('Image decoding fallback activated for page', pageNum);
        // Try to render with simplified context
        try {
          const pdfPage = await pdfRef.current.getPage(pageNum);
          const viewport = pdfPage.getViewport({ scale: getScaleForWidth(pdfPage.getViewport({ scale: 1 })) });
          const context = canvas.getContext('2d');
          
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          // Simplified render context
          const simpleRenderContext = { 
            canvasContext: context, 
            viewport,
            intent: 'display'
          };
          
          const simpleRenderTask = pdfPage.render(simpleRenderContext);
          await simpleRenderTask.promise;
        } catch (fallbackError) {
          console.error('Fallback render also failed:', fallbackError);
        }
      } else {
        console.error('PDF render error:', error);
      }
    } finally {
      // Clear rendering flag
      renderState.current.isRendering[canvasType] = false;
      renderState.current.currentRenderTask[canvasType] = null;
      
      // Check if there's a pending page to render
      const pendingPage = renderState.current.pendingPage[canvasType];
      if (pendingPage !== null) {
        renderState.current.pendingPage[canvasType] = null;
        // Recursively render the pending page
        setTimeout(() => renderPageToCanvas(pendingPage, canvas, canvasType), 0);
      }
    }
  };

  // Queue render request for a specific canvas
  const queueRenderPage = (pageNum, canvas, canvasType) => {
    if (renderState.current.isRendering[canvasType]) {
      renderState.current.pendingPage[canvasType] = pageNum;
    } else {
      renderPageToCanvas(pageNum, canvas, canvasType);
    }
  };

  const renderPages = async () => {
    if (!pdfRef.current) return;
    
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    
    setTurning(false);
    
    if (isMobile) {
      // 📱 Mobile → single page only
      if (leftCanvas) {
        await renderPageToCanvas(page, leftCanvas, 'left');
      }
      // Clear right canvas on mobile
      if (rightCanvas) {
        const ctx = rightCanvas.getContext('2d');
        ctx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
      }
    } else {
      // 💻 Desktop → two-page spread
      if (leftCanvas) {
        await renderPageToCanvas(page, leftCanvas, 'left');
      }
      if (rightCanvas) {
        await renderPageToCanvas(page + 1, rightCanvas, 'right');
      }
    }
  };

  // Keep renderSpread for backward compatibility
  const renderSpread = async (leftPageNum) => {
    await renderPages();
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

  // Enhanced book-flipping with queue management
  const go = (dir) => {
    if (turning) return; // debounce while animating
    
    // Check page boundaries
    if (dir === 'next' && page >= totalPages) return;
    if (dir === 'prev' && page <= 1) return;
    
    setTurnDir(dir);
    setTurning(true);

    // Create a flip overlay image from the current visible page
    const srcCanvas = dir === 'next' ? rightCanvasRef.current : leftCanvasRef.current;
    try {
      const data = srcCanvas?.toDataURL('image/png');
      setFlip({ active: true, side: dir === 'next' ? 'right' : 'left', src: data });
      
      // Start flip animation on next frame
      requestAnimationFrame(() => {
        const el = document.getElementById('page-flip-img');
        if (el) {
          // Force reflow and start animation
          void el.offsetWidth;
          el.classList.add('flip-run');
        }
      });
    } catch (error) {
      console.warn('Failed to create flip image:', error);
    }

    // Calculate next page number
    const nextPage = dir === "next" ? Math.min(totalPages, page + 1) : Math.max(1, page - 1);
    
    // Change page near the end of flip animation
    setTimeout(() => {
      setPage(nextPage);
      // Re-render after page change
      setTimeout(() => {
        renderPages();
      }, 50);
    }, Math.round(TURN_DURATION_MS * 0.8));

    // Complete flip animation
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
    <div className={"bg-white text-gray-900 min-h-screen"}>
      {/* Enhanced Book-Flipping CSS Styles */}
      <style>{`
        .book-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        
        .book-page {
          width: 400px;
          height: 600px;
          margin: 0 5px;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
          border-radius: 5px;
          background: white;
          transform-origin: center;
          transition: transform 0.8s ease-in-out;
        }
        
        .mobile-book-page {
          width: 100%;
          height: 500px;
          margin: 0;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
          border-radius: 8px;
          background: white;
          transform-origin: center;
          transition: transform 0.8s ease-in-out;
        }
        
        .left-page {
          transform-origin: right center;
        }
        
        .right-page {
          transform-origin: left center;
        }
        
        /* Enhanced flip animations */
        .flip-left {
          transform: perspective(1400px) rotateY(180deg) translateX(-10px);
          box-shadow: -10px 0 20px rgba(0,0,0,0.4);
        }
        
        .flip-right {
          transform: perspective(1400px) rotateY(-180deg) translateX(10px);
          box-shadow: 10px 0 20px rgba(0,0,0,0.4);
        }
        
        /* Page curl effect */
        .page-curl {
          position: absolute;
          top: 0;
          right: 0;
          width: 50px;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 100%);
          transform-origin: left center;
          transform: perspective(1000px) rotateY(-15deg);
        }
        
        /* Smooth transitions for canvas elements */
        canvas {
          transition: opacity 0.3s ease-in-out;
        }
        
        .flip-run {
          transform: perspective(1400px) rotateY(-160deg);
        }
        
        /* Hide right canvas on mobile */
        @media (max-width: 1023px) {
          .right-canvas-container {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="h-16" />
      
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="px-4 py-4">
          {/* Mobile Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <Link to={`/book/${slug}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium">
              ← Back
            </Link>
            <div className="text-sm font-semibold text-gray-900 truncate max-w-32">
              {book.title}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowNotes(true)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" title="Add note">
                ✎
              </button>
              <button onClick={toggleBookmark} className={`p-2 rounded-lg border ${isBookmarked ? "bg-[#0B6B4D] text-white border-[#0B6B4D]" : "border-gray-200 hover:bg-gray-50"}`} title="Bookmark">
                <Bookmark className="w-4 h-4" />
              </button>
              <button onClick={() => setFontScale(s => Math.max(80, Math.min(140, s + 10)))} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" title="Font size">
                <Type className="w-4 h-4" />
              </button>
              <button onClick={() => navigator.share?.({ title: book.title, url: window.location.href })} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" title="Share">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Book Surface */}
          <div
            ref={surfaceRef}
            className={`relative mx-auto max-w-full rounded-xl bg-[#f8f8f5] border border-gray-200 shadow-lg overflow-hidden`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Mobile Cover Flip */}
            <div
              className={`absolute inset-0 z-20 pointer-events-none origin-left transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${coverOpen ? "[transform:perspective(1200px)_rotateY(-150deg)] opacity-0" : "opacity-100"}`}
              style={{ backgroundImage: `url(${book.cover})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />

            {/* Mobile Single Page Canvas */}
            <div className={`flex items-stretch justify-center bg-[#f8f8f5] p-3 select-none`}>
              <div className={`mobile-book-page rounded-lg overflow-hidden bg-white shadow-inner relative`} style={{ width: '100%', height: '500px' }}>
                <canvas 
                  ref={leftCanvasRef} 
                  className="block w-full h-full" 
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>

            {/* Mobile Navigation Buttons */}
            <div className="absolute inset-y-0 left-2 flex items-center">
              <button 
                onClick={() => go("prev")} 
                disabled={page <= 1 || turning}
                className="p-2 rounded-full bg-white/90 border border-gray-200 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button 
                onClick={() => go("next")} 
                disabled={page >= totalPages || turning}
                className="p-2 rounded-full bg-white/90 border border-gray-200 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Progress & Controls */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="font-medium">Page {page} of {totalPages}</div>
              <div className="text-xs">{Math.round((page/totalPages)*100)}%</div>
            </div>
            <input
              type="range"
              min={1}
              max={Math.max(1, totalPages)}
              value={page}
              onChange={(e) => setPage(parseInt(e.target.value, 10))}
              className="w-full accent-[#0B6B4D] h-2"
            />
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>Swipe to turn pages</span>
              <span>•</span>
              <span>Tap sides to navigate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block max-w-6xl mx-auto px-4 py-6">
        {/* Desktop Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Link to={`/book/${slug}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
              ← Back to Library
            </Link>
          </div>
          <div className="text-sm font-medium" style={{ color: "#222" }}>{book.title}</div>
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
          className={`relative mx-auto max-w-5xl rounded-[18px] bg-[#f8f8f5] border border-gray-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] overflow-hidden`}
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

          {/* Enhanced Two-page canvas spread with book-flipping animation */}
          <div className={`flex items-stretch justify-center gap-6 bg-[#f8f8f5] p-4 select-none book-container`}>
            {/* Left Page Canvas */}
            <div className={`book-page left-page rounded-md overflow-hidden bg-white shadow-inner relative [transform-style:preserve-3d] transition-transform ease-[cubic-bezier(.2,.8,.2,1)] duration-[650ms] will-change-transform ${turning && turnDir==='prev' ? 'flip-left' : ''}`}>
              {turning && turnDir==='prev' && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent z-10" />
              )}
              <canvas ref={leftCanvasRef} className="block w-full h-full" />
            </div>
            
            {/* Right Page Canvas - Hidden on mobile */}
            <div className={`right-canvas-container book-page right-page rounded-md overflow-hidden bg-white shadow-inner relative [transform-style:preserve-3d] transition-transform ease-[cubic-bezier(.2,.8,.2,1)] duration-[650ms] will-change-transform ${turning && turnDir==='next' ? 'flip-right' : ''}`}>
              {turning && turnDir==='next' && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-10" />
              )}
              <canvas ref={rightCanvasRef} className="block w-full h-full" />
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

          {/* Enhanced Navigation Buttons */}
          <div className="absolute inset-y-0 left-0 flex items-center p-3">
            <button 
              onClick={() => go("prev")} 
              disabled={page <= 1 || turning}
              className="p-3 rounded-full bg-white/90 border border-gray-200 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center p-3">
            <button 
              onClick={() => go("next")} 
              disabled={page >= totalPages || turning}
              className="p-3 rounded-full bg-white/90 border border-gray-200 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6" />
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

      {/* Mobile Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-gray-200 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-gray-800 text-lg">Add note (page {page})</div>
              <button onClick={() => setShowNotes(false)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea 
              value={noteText} 
              onChange={(e)=>setNoteText(e.target.value)} 
              rows={6} 
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-[#0B6B4D] focus:border-transparent" 
              placeholder="Type your highlight note here..." 
            />
            <div className="mt-4 flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowNotes(false)} 
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => { 
                  const raw = localStorage.getItem(`lit-isle-notes-${slug}`); 
                  const arr = raw ? JSON.parse(raw) : []; 
                  arr.push({ page, text: noteText, at: Date.now() }); 
                  localStorage.setItem(`lit-isle-notes-${slug}`, JSON.stringify(arr)); 
                  setNoteText(""); 
                  setShowNotes(false); 
                }} 
                className="px-4 py-2 rounded-lg bg-[#0B6B4D] text-white hover:bg-[#0e7a2b] font-medium"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReader;


