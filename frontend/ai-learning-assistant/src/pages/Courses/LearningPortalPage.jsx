import React, { useEffect, useState } from "react";
import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashcardManager from "../../components/flashcards/FlashcardManager";
import QuizManager from "../../components/quizzes/QuizManager";
import Spinner from "../../components/common/Spinner";
import Tabs from "../../components/common/Tabs";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import semesterService from "../../services/BankQuestionService";
import { ArrowLeft, ExternalLink } from "lucide-react";

const LearningPortalPage = () => {
  const { semesterNumber, courseId } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchCourseDocument = async () => {
      try {
        setLoading(true);
        const pdfData = await semesterService.getFileForLearning(semesterNumber, courseId);
      
      if (pdfData)
        setDocument({ data: pdfData });

      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    if (semesterNumber && courseId)
        fetchCourseDocument();

  }, [semesterNumber, courseId]);

  // HELPER FUNCTION TO GET FULL PDF URL
  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;

    if (filePath.startsWith("http://") || filePath.startsWith("https://"))
      return filePath;

    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) return <Spinner />;

    if (!document || !document.data || !document.data.filePath)
      return <div className="text-center p-8">PDF not available.</div>;

    const pdfUrl = getPdfUrl();

    return (
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-betwee p-4 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-medium text-gray-700">
            Document Viewer
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
        <div className="bg-gray-100 p-1">
          <iframe
            src={pdfUrl}
            frameBorder="0"
            title="PDF Viewer"
            className="w-full h-[70vh] bg-white rounded border border-gray-300"
            style={{
              colorScheme: "light",
            }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface documentId={document?.data?._id} />;
  };

  const renderAIActions = () => {
    return <AIActions documentId={document?.data?._id} />;
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={document?.data?._id} />;
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={document?.data?._id} />;
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) return <Spinner />;

  if (!document)
    return <div className="text-center p-8">Document not found.</div>;

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/semesters/${semesterNumber}`}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </Link>
      </div>

      <PageHeader title={document.data.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default LearningPortalPage;
