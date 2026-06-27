export type ClusterName = 'sinologist' | 'literary' | 'spiritual'

export interface TranslatorMeta {
  name: string          // must match Document.translator in DB exactly
  dates: string         // e.g. "1889–1966"
  cluster: ClusterName
  commentary: string    // ~150 words
}

export interface ClusterGroup {
  name: ClusterName
  label: string
  description: string
  members: string[]     // translator names
}

export const TRANSLATORS: TranslatorMeta[] = [
  {
    name: "Arthur Waley",
    dates: "1889–1966",
    cluster: "sinologist",
    commentary: `Arthur Waley's 1934 translation, published as <em>The Way and Its Power</em>, was the first major English rendering of the Daodejing to achieve both scholarly and literary acclaim. A Cambridge-educated sinologist who also translated classical Japanese poetry, Waley brought unusual philological precision alongside genuine literary sensibility. He resisted the mystical romanticization common in Western reception, preferring to emphasize the text's political and philosophical dimensions over its spiritual ones. His opening line — "The Way that can be told of is not an Unvarying Way" — prioritizes grammatical accuracy over poetry. Waley was openly skeptical of later Daoist religious traditions, treating the Daodejing primarily as a text of the Warring States philosophical debates. His choices set a template that later translators either built on or explicitly reacted against, making his 1934 version an indispensable reference point in the English translation tradition.`,
  },
  {
    name: "Ch'u Ta-Kao",
    dates: "1892–1971",
    cluster: "sinologist",
    commentary: `Ch'u Ta-Kao produced one of the earliest English translations by a Chinese-born scholar, published through the Theosophical Society in London in 1937. Working at a moment when Daoist studies were still nascent in the West, Ch'u brought an insider's familiarity with Chinese philosophical tradition alongside the theosophical interpretive lens of his publishers, which colored some of his rendering choices. His translation is notable for its directness and relatively literal approach compared to later Western adaptations. Ch'u was among the first to make the Daodejing accessible to English readers without the dense scholarly apparatus of European sinology. His work reflects the early twentieth-century cultural moment when Daoism was being introduced to Western audiences who were simultaneously fascinated and uncertain about classical Chinese thought. The text holds a quiet authority that comes from a translator deeply at home in both languages.`,
  },
  {
    name: "Lin Yutang",
    dates: "1895–1976",
    cluster: "literary",
    commentary: `Lin Yutang was a Chinese-American writer, intellectual, and inventor whose prolific career was devoted to bridging Chinese and Western literary cultures. His translation of the Daodejing, appearing in <em>The Wisdom of Laotse</em> (1948), is notable for weaving together passages from the Daodejing with relevant sections from Zhuangzi, creating a synthetic philosophical text. Lin brought bilingual authority and a humanist literary sensibility to the translation, emphasizing practical wisdom and aesthetic beauty over scholarly precision. Unlike academic translators, Lin was primarily a writer, and his version reflects a lifelong project of making Chinese literary culture comprehensible and appealing to Western readers. His rendering is often described as capturing the "flavor" of the original in a way more literal versions miss. Lin's work occupies a unique middle space between popular and scholarly, grounded in genuine linguistic competence but addressed to the general reader.`,
  },
  {
    name: "J.J.L. Duyvendak",
    dates: "1889–1954",
    cluster: "sinologist",
    commentary: `Jan Julius Lodewijk Duyvendak was one of the foremost European sinologists of the mid-twentieth century, holding the chair of Chinese at Leiden University. His 1954 translation <em>Tao Te Ching: The Book of the Way and Its Virtue</em> is distinguished by exhaustive scholarly apparatus and careful attention to textual variants. Duyvendak was deeply engaged with philological problems of the text — questions of composition date, the reliability of the Wang Pi commentary, and ambiguities in classical Chinese syntax — representing the Germanic European tradition of rigorous sinology that prioritized accuracy over literary quality. His translation is less readable than Waley's but more transparently scholarly, showing its interpretive work in extensive footnotes. Although the Ma-wang-tui manuscripts had not yet been discovered, Duyvendak's attention to variant readings anticipated the textual debates those discoveries would later ignite. His work remains an important reference for scholars comparing interpretive traditions.`,
  },
  {
    name: "John C.H. Wu",
    dates: "1899–1986",
    cluster: "spiritual",
    commentary: `John C.H. Wu was a Chinese Catholic jurist, legal scholar, and writer whose translation of the Daodejing is unique for its explicit Christian theological framing. A convert who corresponded with Thomas Merton and later produced an acclaimed translation of the New Testament into classical Chinese, Wu read the Tao through the lens of mystical Christianity, hearing resonances between the Gospel of John's opening ("In the beginning was the Word") and the Daodejing's first line. His translation, published by St. John's University Press in 1961, is notable for lyrical beauty and for making the text accessible to readers from a Christian background. Scholars have noted both the interpretive richness this cross-traditional lens brings and its distortions: Wu's Tao sometimes sounds more like the Christian Logos than the classical Chinese concept. His work is a fascinating document of mid-century cross-cultural theological encounter, and a reminder that all translation involves a frame.`,
  },
  {
    name: "Wing-Tsit Chan",
    dates: "1901–1994",
    cluster: "sinologist",
    commentary: `Wing-Tsit Chan was one of the most influential scholars of Chinese philosophy in the twentieth-century American academy. His <em>A Source Book in Chinese Philosophy</em> (1963) became the standard reference text in university courses on Asian philosophy for decades, and his translation of the Daodejing within it is among the most widely assigned academic versions. Chan's approach is rigorously scholarly: he attends carefully to the philosophical vocabulary of classical Chinese, situates the text within Chinese intellectual history, and provides detailed annotations contextualizing Daoist concepts in relation to Confucian and Neo-Confucian traditions. His translation is less literary than Waley's but more philosophically precise. Chan was particularly attentive to how Daoist categories relate to broader patterns in Chinese thought, treating the Daodejing not as an isolated mystical text but as a participant in ongoing philosophical conversation. His work shaped how multiple generations of Western students first encountered Chinese philosophy.`,
  },
  {
    name: "D.C. Lau",
    dates: "1921–2010",
    cluster: "sinologist",
    commentary: `Dim Cheuk Lau's Penguin Classics translation has arguably been the most widely read English version of the Daodejing in the English-speaking world. A scholar at the School of Oriental and African Studies in London, Lau combined philological rigor with genuine literary care, producing a translation remarkable for clarity and accessibility without sacrificing scholarly accuracy. His 1963 Penguin Classics edition remains in print and is the standard assignment in undergraduate courses worldwide. Lau also produced a separate translation based on the Ma-wang-tui manuscripts in 1982, making him one of the few translators to have produced authoritative versions of both the Wang Pi and Ma-wang-tui texts. His approach is methodical and conservative — he avoids interpretive flourishes and lets the text speak clearly. Lau's influence on the popular reception of the Daodejing in the West is difficult to overstate; for many readers outside academia, his Penguin version simply is the Daodejing.`,
  },
  {
    name: "Gia-fu Feng and Jane English",
    dates: "1919–1985 / b. 1942",
    cluster: "spiritual",
    commentary: `This collaboration between Chinese-born Tai Chi teacher Gia-fu Feng and photographer Jane English produced one of the most beloved and culturally influential translations of the counterculture era. Published by Vintage Books in 1972, the edition pairs Feng's free-flowing translation with English's striking black-and-white nature photography and Feng's Chinese calligraphy, creating a total aesthetic experience that made the text a touchstone for Western practitioners of Tai Chi, yoga, and contemplative traditions. Feng, who had studied at Peking University before immigrating to the United States, brought authentic Chinese cultural sensibility alongside the spiritual openness of the human potential movement. The translation is notably free in places, prioritizing meditative and experiential dimensions over scholarly precision. Though less philologically rigorous than academic versions, it captured something genuinely elusive in the text — the Tao's quality of immediate, wordless presence — that more accurate translations sometimes lose in their precision.`,
  },
  {
    name: "Richard Wilhelm",
    dates: "1873–1930",
    cluster: "literary",
    commentary: `Richard Wilhelm was a German missionary and sinologist who spent decades in China and became one of the most important conduits of classical Chinese thought into Western culture. His German translations of the I Ching (1924) and the Daodejing (1910) introduced these texts to thinkers including Carl Jung, who wrote a celebrated foreword to Wilhelm's I Ching. Wilhelm's approach blended scholarly sinology with genuine cultural immersion — he studied with Chinese teachers and approached the texts with unusual empathy for his era. His Daodejing was later rendered into English, introducing an additional translation layer, but retaining the distinctive quality that comes from a translator who had lived inside Chinese thought rather than merely studied it. Wilhelm saw the Tao in relation to his broader understanding of Chinese cosmology and its resonances with Jungian concepts of the unconscious, giving his rendering a depth that purely academic translations sometimes lack.`,
  },
  {
    name: "Ellen M. Chen",
    dates: "b. 1934",
    cluster: "literary",
    commentary: `Ellen Marie Chen's translation and commentary, published as <em>The Tao Te Ching: A New Translation with Commentary</em> (1989), is notable for its systematic feminist philosophical interpretation. A professor at St. John's University, Chen argued that the Daodejing contains a proto-feminist cosmology centered on the feminine as the primal, creative ground of being. She emphasized recurring feminine imagery in the text — the valley, the mother, yielding water — as philosophically central rather than merely metaphorical, and her translation makes these dimensions explicit throughout. Her commentary situates the text in relation to feminist philosophy and ecofeminism. Chen's work represents an important strand of late twentieth-century Daoist scholarship seeking to recover suppressed feminine and ecological dimensions of the tradition. Her translation is both rigorous scholarship and philosophical intervention, and it opened interpretive possibilities that earlier male translators had largely left unexplored.`,
  },
  {
    name: "Michael LaFargue",
    dates: "b. 1942",
    cluster: "sinologist",
    commentary: `Michael LaFargue's <em>The Tao of the Tao Te Ching</em> (1992) is one of the most methodologically rigorous English translations, distinguished by its sustained attention to the interpretive assumptions that inevitably shape any rendering. A scholar at the University of Massachusetts, LaFargue developed an explicit methodology: he examined each passage's internal logic, potential compositional contexts, and range of possible meanings before committing to translation choices. His translation is deliberately non-poetic, prioritizing semantic content over literary effect. LaFargue's work directly informs this study: his list of reputable translations formed the authority baseline against which all 180+ versions were evaluated. He was also deeply engaged with questions about the Daodejing's compositional history and its relationship to early Chinese oral traditions — treating the text not as a single authored work but as an anthology of sayings that accreted over time. His methodological transparency makes his choices unusually easy to evaluate and critique.`,
  },
  {
    name: "Stephen Addiss and Stanley Lombardo",
    dates: "b. 1935 / b. 1943",
    cluster: "literary",
    commentary: `This collaboration between art historian Stephen Addiss and poet-translator Stanley Lombardo produced one of the most spare and minimalist English translations of the Daodejing. Addiss brought expertise in East Asian art and calligraphy; Lombardo had previously translated Homer and Virgil with a distinctive contemporary poetic voice. Together they created a version remarkable for its economy of language — often using fewer words than the Chinese original, stripping away conjunctions, articles, and explanatory additions to achieve a kind of semantic transparency. Their Chapter 1 is among the most tightly compressed in the English translation tradition. The translation has been praised for capturing the laconic quality of classical Chinese, though critics note it sometimes sacrifices philosophical nuance for poetic effect. Published in 1993 by Hackett, it remains influential among readers who prefer the Daodejing as poetry rather than as philosophy, and among those who see compression itself as a form of fidelity.`,
  },
  {
    name: "Robert Henricks",
    dates: "b. 1943",
    cluster: "sinologist",
    commentary: `Robert Henricks's <em>Lao-Tzu: Te-Tao Ching</em> (1989) is distinctive as the first major English translation based on the Ma-wang-tui silk manuscripts, discovered in a Han dynasty tomb at Mawangdui, Hunan, in 1973. These manuscripts, dating to approximately 200 BCE, predate the Wang Pi commentary text by several centuries and contain significant textual differences. Most notably, the Ma-wang-tui version reverses the order of the two parts: the "Te" section comes before the "Tao" section — hence Henricks's title <em>Te-Tao Ching</em> rather than <em>Tao Te Ching</em>. Henricks, a professor at Dartmouth, brought rigorous philological scholarship to comparing the two textual traditions. His work opened new questions about the original composition of the text and challenged assumptions based solely on the Wang Pi commentary. For scholars, Henricks's translation is essential for understanding how the Daodejing was transmitted and transformed across the centuries before it reached its standard received form.`,
  },
  {
    name: "Victor H. Mair",
    dates: "b. 1943",
    cluster: "sinologist",
    commentary: `Victor Mair's translation, published as <em>Tao Te Ching: The Classic Book of Integrity and the Way</em> (1990), draws on wide comparative linguistic and historical scholarship to situate the Daodejing in its broadest possible context. Mair, a professor at the University of Pennsylvania, was particularly interested in connections between early Daoist thought and Central Asian and Indo-European traditions, arguing that some Daoist concepts may have entered China through contact with steppe peoples. His translation is notable for rendering "Tao" as "Way" and "Te" as "Integrity" — choices reflecting his commitment to stripping away centuries of accumulated interpretation and returning to a more etymologically grounded reading. Mair also drew on early manuscript traditions and brought comparative mythology and linguistics to bear on difficult passages. His work remains controversial among specialists but represents one of the most adventurous and far-reaching scholarly approaches to the text, consistently asking what the words originally meant before tradition calcified around them.`,
  },
  {
    name: "Stephen Mitchell",
    dates: "b. 1943",
    cluster: "spiritual",
    commentary: `Stephen Mitchell is an American poet and translator whose 1988 rendering of the Daodejing became one of the bestselling English versions ever published. Mitchell reads no classical Chinese; his translation was assembled from comparison of existing English versions and consultation with scholars. The sinologist Paul Goldin singled out Mitchell's version for criticism in his essay "Those Who Don't Know Speak," arguing that working without access to the original allows a translator to select the palatable and discard the difficult. Mitchell's defense — that fidelity to the spirit matters more than fidelity to the letter — is a position with its own long history in translation theory. Whatever its philological standing, his version is widely credited with introducing the Daodejing to a generation of Western readers who would never have sought out an academic translation. The embeddings place it far from the sinologist cluster.`,
  },
  {
    name: "Ursula K. Le Guin",
    dates: "1929–2018",
    cluster: "literary",
    commentary: `Ursula K. Le Guin was one of the most celebrated American fiction writers of the twentieth century, whose science fiction and fantasy drew deeply on Daoist thought — particularly the concepts of wu wei, cyclical change, and yielding as strength. Her 1997 rendering, subtitled "A Book about the Way and the Power of the Way," was explicitly a writer's translation rather than a scholar's: she worked from existing versions with the help of J.P. Seaton, a sinologist, but made no claim to translate from the Chinese directly. Her introduction is a small classic of translation theory, arguing for the Daodejing as a "feminist" and "anarchist" text. Her version is notable for its spare contemporary diction, its short lines, and its avoidance of mystifying terminology. Goldin included her among the American non-readers he criticized; her embeddings cluster with the literary adapters.`,
  },
  {
    name: "Witter Bynner",
    dates: "1881–1968",
    cluster: "literary",
    commentary: `Witter Bynner was an American poet who produced a translation of the Daodejing in 1944 in collaboration with Kiang Kang-hu, a Chinese scholar who provided literal cribs that Bynner then rendered into English verse. The collaboration was genuinely cross-cultural in its method, though Bynner himself could not read Chinese. His version, published as <em>The Way of Life According to Laotzu</em>, is notable for its loose, ruminative quality — closest in spirit to a paraphrase, furthest in letter from the Chinese. Paul Goldin cited Bynner among the non-readers whose versions he criticized. The opening lines are striking: Bynner replaces "Tao" entirely with "Existence," a choice that cuts against the philosophical specificity the term carries and signals his primary allegiance to accessibility over fidelity. His version was widely read in the mid-twentieth century and influenced later literary adapters.`,
  },
  {
    name: "Aleister Crowley",
    dates: "1875–1947",
    cluster: "literary",
    commentary: `Aleister Crowley — occultist, poet, and provocateur — produced a translation of the Daodejing in 1918 as part of his broader project of synthesizing Western occultism with Eastern philosophy. He titled it the "Tao Teh King" and read it through the lens of his own magical system, Thelema, most visibly in Chapter 1: where other translators see "desire" as an epistemological stance, Crowley hears "fulfilling one's will" — the central imperative of Thelema. The result is a translation that says something genuinely different from any other version, not because the Chinese permits it but because Crowley's interpretive frame was entirely his own. It is among the most eccentric texts in the English translation tradition and has found a devoted readership in occult circles. As a data point, it is a near-perfect illustration of how a translator's prior commitments shape what they find in the text.`,
  },
]

export const CLUSTERS: ClusterGroup[] = [
  {
    name: "sinologist",
    label: "The Sinologists",
    description: "Trained scholars of classical Chinese — translating from the original, with philological apparatus. These cluster tightly in semantic space.",
    members: ["Arthur Waley", "Ch'u Ta-Kao", "J.J.L. Duyvendak", "Wing-Tsit Chan", "D.C. Lau", "Michael LaFargue", "Robert Henricks", "Victor H. Mair"],
  },
  {
    name: "literary",
    label: "The Literary Adapters",
    description: "Translators who balanced scholarly grounding with literary ambition — seeking style and feeling alongside accuracy.",
    members: ["Lin Yutang", "Richard Wilhelm", "Ellen M. Chen", "Stephen Addiss and Stanley Lombardo", "Gia-fu Feng and Jane English", "Ursula K. Le Guin", "Witter Bynner", "Aleister Crowley"],
  },
  {
    name: "spiritual",
    label: "The Spiritual Interpreters",
    description: "Translations driven by spiritual or theological frames — prioritizing the contemplative and experiential over the philological.",
    members: ["John C.H. Wu", "Gia-fu Feng and Jane English", "Stephen Mitchell"],
  },
]
