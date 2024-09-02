import Upload from "@/components/uploadForm";
import { Toaster } from "@/components/toaster";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-32">
      <section className="flex-col md:flex-row flex items-center md:justify-between mb-5 md:mb-12">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
          Blob.
        </h1>
      </section>
      <Toaster />
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-neutral-200 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
        <Upload />
      </div>
    </main>
  );
}
