import Upload from "@/components/uploadForm";
import { Toaster } from "@/components/toaster";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 pt-16 pb-20">
      <section className="flex-col md:flex-row flex items-center md:justify-between mb-5 md:mb-12">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
          Blob.
        </h1>
      </section>
      <Toaster />
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Upload />
      </div>
    </main>
  );
}
