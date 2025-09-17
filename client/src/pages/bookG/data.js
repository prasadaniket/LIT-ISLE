// Centralized book data for Book Detail pages

export const booksData = {
  frankenstein: {
    slug: "frankenstein",
    title: "Frankenstein",
    author: "Deanna McFadden",
    originalAuthor: "Mary Shelley (1818)",
    genres: [
      "Children’s",
      "Classics",
      "Fantasy",
      "Fiction",
      "Horror",
      "Mystery",
      "Science Fiction",
    ],
    series: "-",
    isbn: "9781402726668",
    asin: "140272666X",
    language: "English",
    publicationDate: "March 28, 2006",
    description:
      "This California edition of the Pennyroyal Press Frankenstein brings together the haunting depth of Barry Moser’s illustrations with Mary Shelley’s timeless 1818 narrative. Through a striking sequence of woodcuts, the reader witnesses the chilling creation of the ‘monster’ - a being simultaneously grotesque in its malice and mesmerizing in its anguish. This edition captures both the gothic horror and the profound moral questions that have made Frankenstein an enduring classic.",
    cover: "/Books/covers/frankensrein.jpg",
    ratingAvg: 4.2,
    ratingsCount: 12458,
    reviewsCount: 2310,
    authorInfo: {
      name: "Mary Shelley",
      booksCount: 7,
      followers: 220000,
      bio: "English novelist best known for Frankenstein; or, The Modern Prometheus (1818), a cornerstone of Gothic literature and early science fiction.",
    },
  },
  dracula: {
    slug: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    genres: [
      "Fantasy",
      "Fiction",
      "Gothic",
      "Horror",
      "Literature",
      "Paranormal",
      "Vampires",
    ],
    series: "-",
    isbn: "9780393970128",
    asin: "0393970124",
    language: "English",
    publicationDate: "May 26, 1897",
    description: `Jonathan Harker travels to Transylvania to assist Count Dracula with the purchase of a London estate, only to uncover horrifying truths about his mysterious client. Soon after, strange events begin unfolding in England - an unmanned ship wrecks on the coast of Whitby, a young woman discovers puncture marks on her neck, and an asylum patient raves about the ‘Master’ and his imminent arrival.

In Dracula, Bram Stoker created one of the greatest masterpieces of gothic horror, conjuring a world of vampires and hunters while also exploring the dark undercurrents of Victorian sexuality and desire.

This Norton Critical Edition offers a comprehensive experience:

Contexts - probable inspirations for Dracula, including works by James Malcolm Rymer and Emily Gerard, Stoker’s working notes, and the original opening chapter Dracula’s Guest.

Reviews and Reactions - five early reviews of the novel.

Dramatic and Film Variations - coverage of stage and film adaptations that highlight the novel’s enduring legacy, with contributions from David J. Skal, Gregory A. Waller, and Nina Auerbach.

Criticism - seven theoretical interpretations by Phyllis A. Roth, Carol A. Senf, Franco Moretti, Christopher Craft, Bram Dijkstra, Stephen D. Arata, and Talia Schaffer.

Additional Material - a detailed chronology and a selected bibliography.`,
    cover: "/Books/covers/dracula.jpg",
    ratingAvg: 4.3,
    ratingsCount: 38921,
    reviewsCount: 5540,
    authorInfo: {
      name: "Bram Stoker",
      booksCount: 12,
      followers: 310000,
      bio: "Irish novelist and short story writer, landmark figure in Gothic horror literature; author of the iconic Dracula (1897).",
    },
  },
  "moby-dick": {
    slug: "moby-dick",
    title: "Moby Dick: Castellano",
    author: "Helman Melville",
    genres: ["Classic Fiction"],
    series: "-",
    asin: "B08WPNZQ2X",
    publicationDate: "February 15, 2021",
    description: `Moby Dick (originally Moby-Dick; or, The Whale) follows the journey of Ishmael, a restless man who signs up for a whaling voyage aboard the Pequod. The ship is captained by the monomaniacal Ahab, who seeks revenge on the great white whale, Moby Dick, that had previously crippled him. As the Pequod sails across the oceans, the crew confronts the terrifying power of nature, obsession, fate, and the unknown. Themes of vengeance, faith, and the struggle of humankind against the vast, indifferent seas are woven throughout. In the end, Ahab’s quest for the whale leads to tragic consequence, with Ishmael surviving as the lone witness.`,
    cover: "/Books/covers/moby-dick.jpg",
    ratingAvg: 4.0,
    ratingsCount: 15421,
    reviewsCount: 2011,
    authorInfo: {
      name: "Herman Melville",
      booksCount: 10,
      followers: 180000,
      bio: "American novelist, poet, and short-story writer best known for Moby Dick; or, The Whale (1851).",
    },
  },
  "the-great-gatsby": {
    slug: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genres: [
      "Fiction",
      "Historical Fiction",
      "Literature",
      "Novels",
      "School",
      "Romance",
    ],
    language: "English",
    publicationDate: "April 10, 1925",
    description: `The Great Gatsby, F. Scott Fitzgerald’s third novel, is widely regarded as his greatest work and a defining masterpiece of American literature. First published in 1925, the novel captures the essence of the Jazz Age - an era when, as The New York Times observed, “gin was the national drink and sex the national obsession.”

The story follows the enigmatic and wealthy Jay Gatsby and his unrelenting love for Daisy Buchanan, set against the backdrop of lavish Long Island parties, social upheaval, and the pursuit of the American Dream. Beneath its glittering surface, the novel explores themes of ambition, excess, illusion, and disillusionment in 1920s America.

This definitive edition incorporates the author’s final revisions, a note on composition and text by James L.W. West III, a foreword by Fitzgerald’s granddaughter Eleanor Lanahan, and a new introduction by two-time National Book Award winner Jesmyn Ward. Generations of readers have embraced The Great Gatsby as the quintessential novel of its time, continuing to find relevance and beauty in Fitzgerald’s timeless prose.`,
    cover: "/Books/covers/The-Great-Gatsby.jpg",
    ratingAvg: 4.4,
    ratingsCount: 51234,
    reviewsCount: 8922,
    authorInfo: {
      name: "F. Scott Fitzgerald",
      booksCount: 5,
      followers: 260000,
      bio: "American author whose works define the Jazz Age; widely considered one of the greatest American writers.",
    },
  },
  "sherlock-holmes": {
    slug: "sherlock-holmes",
    title: "The Adventures of Sherlock Holmes",
    author: "Chris Sasaki",
    genres: [
      "British Literature",
      "Children’s",
      "Classics",
      "Crime",
      "Fiction",
      "Mystery",
      "Short Stories",
    ],
    isbn: "9781402712173",
    asin: "1402712170",
    language: "English",
    publicationDate: "March 1, 2005",
    description: `Why does a burglar keep smashing statues of Napoleon? Where is the missing blue carbuncle? And who is the mysterious Irene Adler?

In The Adventures of Sherlock Holmes, readers join the brilliant detective Sherlock Holmes and his loyal companion Dr. Watson as they unravel the truth behind these puzzling cases and many more. This collection brings together some of Arthur Conan Doyle’s most iconic stories, including:

A Scandal in Bohemia

The Redheaded League

The Adventure of the Blue Carbuncle

The Adventure of the Speckled Band

The Greek Interpreter

The Adventure of the Six Napoleons

Rich in intrigue, wit, and suspense, these timeless tales continue to captivate readers with their clever twists and unforgettable characters.`,
    cover: "/Books/covers/The-Adventures-of-Sherlock-Holmes.jpg",
    ratingAvg: 4.6,
    ratingsCount: 44110,
    reviewsCount: 7123,
    authorInfo: {
      name: "Arthur Conan Doyle",
      booksCount: 50,
      followers: 450000,
      bio: "British writer and physician, creator of Sherlock Holmes; wrote across fantasy, science fiction, and historical genres.",
    },
  },
  "alice-in-wonderland": {
    slug: "alice-in-wonderland",
    title: "Alice’s Adventures in Wonderland and Other Tales",
    author: "Lewis Carroll",
    genres: [
      "Anthologies",
      "Children’s",
      "Classics",
      "Collections",
      "Fairy Tales",
      "Fantasy",
      "Fiction",
      "Literature",
      "Poetry",
      "Short Stories",
      "Young Adult",
    ],
    series: "Knickerbocker Classic Series",
    isbn: "9781631060687",
    language: "English",
    publicationDate: "May 19, 2015",
    description: `This elegant gift edition presents the complete collection of Alice’s Adventures in Wonderland along with the full writings of Lewis Carroll, accompanied by the original, iconic illustrations of John Tenniel. Part of the Knickerbocker Classic series, this unabridged edition includes both Alice’s Adventures in Wonderland and Through the Looking-Glass, Carroll’s famous nonsense poems such as The Hunting of the Snark and Jabberwocky, the novels Sylvie and Bruno and Sylvie and Bruno Concluded, as well as essays and miscellaneous works from the prolific author.

Beautifully bound with cloth and a ribbon marker, and packaged in an elegant slipcase, this edition also features a new introduction. For over 150 years, Lewis Carroll’s whimsical puns, puzzles, and fantastical tales have enchanted readers of all ages, making this volume a perfect keepsake for fans and collectors alike.`,
    cover: "/Books/covers/Alices-Adventures-in-Wonderland-and-Other-Tales.jpg",
    ratingAvg: 4.5,
    ratingsCount: 48771,
    reviewsCount: 6901,
    authorInfo: {
      name: "Lewis Carroll",
      booksCount: 15,
      followers: 210000,
      bio: "English author, poet, mathematician, and photographer celebrated for literary nonsense and clever wordplay.",
    },
  },
  "shakespeare-works-vol1": {
    slug: "shakespeare-works-vol1",
    title: "The Complete Works of William Shakespeare, Volume 1 of 2",
    author: "William Shakespeare",
    genres: [
      "Anthologies",
      "Classics",
      "Drama",
      "Fiction",
      "Literature",
      "Plays",
      "Poetry",
    ],
    language: "English",
    publicationDate: "January 1, 1621",
    description: `The Complete Works of William Shakespeare, Volume 1 of 2 brings together the dramatic and poetic masterpieces of the world’s most celebrated playwright. This volume traces the early stages of Shakespeare’s career, with plays such as Romeo and Juliet and Richard II - first printed in 1597 when Shakespeare was thirty-three years old - and explores the chronology of his earliest dramatic works, including Henry VI.

While Shakespeare first gained recognition as an actor, it is his writing that has immortalized him. His plays and poetry not only transformed English drama but also shaped the course of world literature.

This edition, reproduced by Forgotten Books, uses advanced digital technology to restore and preserve the original format while repairing imperfections found in aged copies. Minor flaws may remain to maintain the authenticity of the original historical work. This careful balance between preservation and readability makes the volume both a valuable scholarly resource and an accessible edition for readers seeking to experience Shakespeare’s works in their authentic form.`,
    cover:
      "/Books/covers/The-Complete-Works-of-William-Shakespeare,-Volume-1-of-2.jpg",
    ratingAvg: 4.7,
    ratingsCount: 62331,
    reviewsCount: 9911,
    authorInfo: {
      name: "William Shakespeare",
      booksCount: 39,
      followers: 900000,
      bio: "English playwright, poet, and actor, widely regarded as the greatest writer in the English language.",
    },
  },
  "origin-of-species": {
    slug: "origin-of-species",
    title: "On the Origin of Species and Other Stories",
    author: "Bo-young Kim",
    originalAuthor: "Charles Darwin",
    genres: ["Fiction", "Science Fiction", "Fantasy", "Short Stories"],
    isbn: "9781885030740",
    asin: "B0DR347M5H",
    language: "English",
    publicationDate: "May 25, 2021",
    description: `On the Origin of Species and Other Stories presents a collection of groundbreaking posthuman science fiction from Bo-young Kim, one of South Korea’s most acclaimed and influential writers. Longlisted for the 2021 National Book Award in Translated Literature, this volume introduces English-language readers to some of her most celebrated works alongside an essay on science fiction.

Kim’s stories blend science fiction, fantasy, and myth, populated with both human and non-human beings struggling for survival and transformation through biological, technological, and social evolution. Her writing is strikingly original, intellectually rigorous, and deeply poignant, offering profound reflections on the possibilities of posthuman existence.

A pioneer in South Korean speculative fiction, Bo-young Kim won the inaugural Korean Science and Technology Creative Writing Award in 2004 and has received the South Korean SF Novel Award three times. Beyond her writing, she has contributed as a lecturer, editor, and consultant, including working with director Bong Joon-ho on Snowpiercer. This collection affirms her place as one of the most compelling voices in contemporary science fiction.`,
    cover: "/Books/covers/On-the-Origin-of-Species-and-Other-Stories.jpg",
    ratingAvg: 4.3,
    ratingsCount: 6212,
    reviewsCount: 802,
    authorInfo: {
      name: "Bo-young Kim",
      booksCount: 10,
      followers: 52000,
      bio: "Pioneering South Korean speculative fiction writer; advisor on Snowpiercer and award-winning author of posthuman SF.",
    },
  },
  walden: {
    slug: "walden",
    title: "Walden; or, Life in the Woods",
    author: "Henry David Thoreau",
    genres: ["Classics", "Environment", "Nature", "Nonfiction", "Philosophy"],
    isbn: "9780691096124",
    language: "English",
    publicationDate: "August 9, 1854",
    description: `Originally published in 1854, Walden; or, Life in the Woods is Henry David Thoreau’s timeless account of his experiment in simple living, drawn from the two years he spent in a secluded cabin by Walden Pond. Considered one of the most influential works of American literature, Walden reflects Thoreau’s profound engagement with nature, self-reliance, and philosophical inquiry.

Much of the book’s material is derived from Thoreau’s journals and includes memorable chapters such as Reading and The Pond in Winter. Other sections recount his encounters with neighbors, visits to Concord, and his cultivation of a bean field - moments that serve as meditations on society, solitude, and the natural world.

This authoritative edition, introduced by noted American writer John Updike for the 150th anniversary, remains true to Thoreau’s original intent, offering readers both a work of social criticism and a lasting celebration of individual freedom and harmony with nature.`,
    cover: "/Books/covers/Walden.jpg",
    ratingAvg: 4.0,
    ratingsCount: 22110,
    reviewsCount: 3210,
    authorInfo: {
      name: "Henry David Thoreau",
      booksCount: 20,
      followers: 140000,
      bio: "American naturalist, essayist, poet, and philosopher; leading figure in Transcendentalism.",
    },
  },
  "art-of-war": {
    slug: "art-of-war",
    title: "Art of War",
    author: "Petros Triantafyllou",
    genres: [
      "Anthologies",
      "Dark Fantasy",
      "Epic Fantasy",
      "Fiction",
      "Short Stories",
      "Sword and Sorcery",
    ],
    isbn: "9781983961304",
    asin: "1983961302",
    language: "English",
    publicationDate: "February 13, 2018",
    description: `Art of War is a powerful fantasy anthology featuring an impressive lineup of acclaimed authors, including Mark Lawrence, Ed Greenwood, Brian Staveley, John Gwynne, Sebastien De Castell, Nicholas Eames, Anna Smith Spark, RJ Barker, and many more. This collection unites diverse voices from across the fantasy genre, weaving together stories of epic battles, dark sorcery, and heroic struggles.

The print edition also includes forty black-and-white interior art pieces, adding a striking visual dimension to the tales. With a foreword by Brian D. Anderson, Art of War stands as both a celebration of fantasy storytelling and a companion volume - Book 4.5 - in John Gwynne’s The Faithful and the Fallen series, offering readers an unmissable experience of sword and sorcery at its finest.`,
    cover: "/Books/covers/Art-of-War.jpg",
    ratingAvg: 4.6,
    ratingsCount: 4110,
    reviewsCount: 522,
    authorInfo: {
      name: "Petros Triantafyllou",
      booksCount: 4,
      followers: 12000,
      bio: "Editor/author associated with the Faithful and the Fallen companion volume and fantasy anthologies.",
    },
  },
  "vindication-of-rights-of-woman": {
    slug: "vindication-of-rights-of-woman",
    title: "A Vindication of the Rights of Woman",
    author: "Mary Wollstonecraft",
    genres: [
      "Classics",
      "Essays",
      "Feminism",
      "Gender",
      "History",
      "Literature",
      "Nonfiction",
      "Philosophy",
      "Politics",
      "Women’s Studies",
    ],
    isbn: "9780141441252",
    language: "English",
    publicationDate: "1792",
    description:
      "Foundational text of feminist philosophy arguing for rational education and full citizenship for women; a lasting argument for gender equality.",
    cover: "/Books/covers/A-Vindication-of-the-Rights-of-Woman.jpg",
    ratingAvg: 4.1,
    ratingsCount: 9120,
    reviewsCount: 1103,
    authorInfo: {
      name: "Mary Wollstonecraft",
      booksCount: 12,
      followers: 80000,
      bio: "English writer and philosopher; foundational feminist thinker and advocate of women’s rights.",
    },
  },
  "thirty-nine-steps": {
    slug: "thirty-nine-steps",
    title: "The Thirty-Nine Steps (Richard Hannay, #1)",
    author: "John Buchan",
    genres: [
      "Adventure",
      "Classics",
      "Crime",
      "Espionage",
      "Fiction",
      "Mystery",
      "Thriller",
    ],
    isbn: "1853260800",
    asin: "B0083Z5UBM",
    language: "English",
    publicationDate: "January 1, 1915",
    description: `First published in 1915, The Thirty-Nine Steps is John Buchan’s classic adventure thriller and the first novel to feature Richard Hannay. Bored with London society, Hannay finds his life abruptly transformed when a resourceful South African engineer draws him into a deadly conspiracy involving secret codes, foreign spies, and political murder on the eve of World War I. When his mysterious neighbor is murdered, Hannay - wrongly suspected - deciphers the cryptic journal left behind and flees to his native Scotland. Disguising himself and slipping into local dialects, he races across the wild countryside, evading both German agents and the authorities.

This novel, blending fast-paced espionage with vivid landscapes, laid the foundation for the modern spy thriller and cemented Hannay as one of literature’s enduring heroes.`,
    cover: "/Books/covers/The-Thirty-Nine-Steps-Richard-Hannay-1.jpg",
    ratingAvg: 4.2,
    ratingsCount: 11891,
    reviewsCount: 1520,
    authorInfo: {
      name: "John Buchan",
      booksCount: 50,
      followers: 42000,
      bio: "Scottish novelist and politician, best known for adventure stories and spy thrillers.",
    },
  },
  "mountains-of-madness": {
    slug: "mountains-of-madness",
    title: "At the Mountains of Madness",
    author: "H. P. Lovecraft",
    genres: [
      "Classics",
      "Fantasy",
      "Fiction",
      "Horror",
      "Lovecraftian",
      "Novels",
      "Science Fiction",
      "Short Stories",
      "Weird Fiction",
    ],
    isbn: "9780241341315",
    language: "English",
    publicationDate: "1936",
    description: `First written in 1931 and published in 1936, At the Mountains of Madness is considered H. P. Lovecraft’s quintessential tale of supernatural horror. Told as a chilling recollection of an Antarctic expedition, the narrative gradually unveils uncanny discoveries in the icy wastes - culminating in an encounter with an ancient, otherworldly menace hidden within the ruins of a lost civilization. A milestone of macabre literature, the novella exemplifies Lovecraft’s mastery of cosmic dread and remains a cornerstone of the Cthulhu Mythos.`,
    cover: "/Books/covers/At-the-Mountains-of-Madness.jpg",
    ratingAvg: 4.4,
    ratingsCount: 15110,
    reviewsCount: 1980,
    authorInfo: {
      name: "H. P. Lovecraft",
      booksCount: 100,
      followers: 330000,
      bio: "American writer credited as the father of weird fiction and cosmic horror.",
    },
  },
};
