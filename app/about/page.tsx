import Link from 'next/link'

export default function About() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Link className="pt-4 w-full p-10 text-right" href="/">Home</Link>
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Tao Translations
      </h1>
      <div className="bg-white/30 p-6 lg:p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
        <h2><strong>Translating the <em>Laozi</em>: Can Textual Analysis Indicate Translation Authority?</strong></h2>
        <br></br>
        <p>The Daodejing has been called the most translated text besides the Bible, and currently has over 250 translations in Western languages. Its text is an &quot;anthology of earlier sayings and teachings&quot;, from the oral tradition of “Laoist” schools around 300 B.C., as well as additions made by teachers who “composed” and arranged the sayings into chapters. The standard traditional Chinese text of the Daodejing is translated from the Wang Pi commentary, although some more recent translations are based on the Ma-wang-tui manuscripts.</p>
        <br></br>
        <p>The proliferation of the Daodejing has had profound influences in both the east and west. In ancient China, it represented an opposition to the presiding Confucian cultural system. Over the centuries, Daoist commentaries and cults emerged with roots tracing back to the original text. In the West, the Daodejing is popular both among academics as a rich historical document and to the layperson for its lessons. For our purposes, we consider the Daodejing because of the multitude of unique translations into English. </p>
        <br></br>
        <code className="text-sm">
          <p><strong>Sources</strong></p>
          <p>Paul Goldin. <em>After Confucius - Studies in Early Chinese Philosophy</em>. Honolulu: University of Hawai’i Press. 2005.</p>
          <p>Livia Kohn and Michael LaFargue. <em>Lao-tzu and the Tao-te-ching</em>. New York: State University of New York Press. 1998.</p>
          <p>Michael LaFargue. <em>Tao and Method: A Reasoned Approach to the Tao Te Ching</em>. New York: State University of New York Press. 1994.</p>
          <p>Tao Hyum Kim. &quot;Other Laozi Parallels in the Hanfeizi&quot;. <em>Sino-Platonic Papers</em>, 199. 2010.</p>
          <p>182 Translations of Chapter One of Daodejing. Bopsecrets. Accessed: 18 December 2015. Source: <a href="http://www.bopsecrets.org/gateway/passages/tao-te-ching.htm">http://www.bopsecrets.org/gateway/passages/tao-te-ching.htm</a></p>
        </code>
      </div>
    </main>
  )
}
