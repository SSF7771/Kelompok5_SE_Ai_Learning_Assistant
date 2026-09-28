import React from 'react';
import { 
  BookOpen, 
  FileText, 
  BrainCircuit, 
  GraduationCap, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  UploadCloud,
  Layers
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr p-2 rounded-xl shadow-md shadow-cyan-500/20">
              <img
                src="/LogoB3.png"
                className="w-8 h-auto"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              B-Nexus
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-cyan-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-600 transition">How It Works</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Log in
            </a>
            <a 
              href="/register" 
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition active:scale-95"
            >
              Get Started Free
            </a>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-100/50 to-transparent -z-10 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Study Assistant for Smarter Learning
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Transform Your PDFs Into <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">Flashcards & Quizzes</span> Instantly.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your lecture notes, turn them into interactive learning tools, or access curated merged materials tailored specifically for <span className="font-semibold text-slate-800">Binus University</span> students.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold shadow-xl shadow-cyan-500/25 hover:opacity-95 transition flex items-center justify-center gap-2 group"
            >
              Upload Your First PDF
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </a>
          </div>

          {/* Hero Visual Representation (Dashboard Sneakpeek) */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xl shadow-slate-200">
            <div className="p-8 bg-slate-50 rounded-b-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <FileText className="w-8 h-8 text-cyan-600 mb-3" />
                <div className="text-xs font-semibold text-slate-400 uppercase">Total Documents</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">3 Materials</div>
                <p className="text-xs text-slate-500 mt-2">C# Guide 101, Algorithms...</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <BookOpen className="w-8 h-8 text-teal-500 mb-3" />
                <div className="text-xs font-semibold text-slate-400 uppercase">Total Flashcards</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">10 Cards Ready</div>
                <p className="text-xs text-slate-500 mt-2">Auto-generated from key terms</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <BrainCircuit className="w-8 h-8 text-indigo-500 mb-3" />
                <div className="text-xs font-semibold text-slate-400 uppercase">Total Quizzes</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">1 Active Quiz</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">Powerful Learning Workflow</h2>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900">Everything you need to master your coursework</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">PDF Upload & Summarize</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Drop any PDF document or lecture notes. Our AI reads through the content to break down complex topics into clear, concise summaries.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Flashcard Generation</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Automatically extract key definitions, syntax rules, and concepts to build interactive flashcards for active recall practice.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Custom Quizzes</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Test your understanding right away. B-Nexus generates customized multiple-choice tests matching your specific study materials.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* BINUS SECTION */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
                <GraduationCap className="w-4 h-4" />
                Exclusive Campus Feature
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Built Specially for <span className="text-cyan-400">Binus University</span> Students.
              </h2>
              
              <p className="mt-6 text-slate-300 text-base sm:text-lg leading-relaxed">
                No more jumping between multiple fragmented files. Our dedicated Binus University portal features <span className="text-white font-semibold">pre-merged PDF materials</span> mapped directly to your semester modules.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                  <p className="text-sm text-slate-300"><strong className="text-white">Merged Module PDFs:</strong> Week-by-week syllabus sheets combined into master study files.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                  <p className="text-sm text-slate-300"><strong className="text-white">Instant AI Generation:</strong> Apply flashcards and quiz generation directly onto official university curriculum kits.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                  <p className="text-sm text-slate-300"><strong className="text-white">Peer Synced:</strong> Up-to-date materials reflecting current semester syllabus changes.</p>
                </div>
              </div>
            </div>

            {/* Visual Card representing Binus University Hub */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    BN
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Binus University Hub</h4>
                    <p className="text-xs text-slate-400">Computer Science 2024 - 2026</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified By Binusian Admins
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Merged_Materials_Sesi_1-No.pdf</div>
                      <div className="text-xs text-slate-400">Merged from x lecture files • x MB</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg">Ready to Quiz</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Advanced_Csharp_Masterkit.pdf</div>
                      <div className="text-xs text-slate-400">Merged from x lecture files • x MB</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg">Ready to Quiz</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                <p className="text-xs text-slate-400">✨ Click any merged PDF to instantly generate custom flashcards & quizzes.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg text-white">
              <img
                src="/LogoB3.png"
                className="w-8 h-auto"
              />
            </div>
            <span className="text-lg font-bold text-slate-900">B-Nexus</span>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} B-Nexus. Empowering student learning outcomes.
          </p>

          <div className="flex space-x-6 text-sm text-slate-600">
            <a href="#" className="hover:text-cyan-600 transition">Privacy</a>
            <a href="#" className="hover:text-cyan-600 transition">Terms</a>
            <a href="#" className="hover:text-cyan-600 transition">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}