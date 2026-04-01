import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Auth/loginPage';
import RegisterPage from './pages/Auth/registerPage';
import NotFoundPage from './pages/notFoundPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DocumentListPage from './pages/Documents/documentListPage';
import DocumentDetailPage from './pages/Documents/documentDetailPage';
import FlashCardsListPage from './pages/Flashcards/flashCardsListPage';
import FlashCardPage from './pages/Flashcards/flashCardPage';
import QuizTakePage from './pages/Quizzes/quizTakePage';
import QuizResultPage from './pages/Quizzes/quizResultPage';
import ProfilePage from './pages/Profile/profilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import BankQuestionsPage from './pages/BankQuestions/BankQuestionsPage';
import SemesterDetailsPage from './pages/Semesters/SemesterDetailsPage';
import CourseDetailsPage from './pages/Courses/CourseDetailsPage';
import CourseChoicePage from './pages/Semesters/CourseChoicePage';
import LearningPortalPage from './pages/Courses/LearningPortalPage';

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if(loading)
  {
    return (
      <div className="">
        <p className="">Loading...</p>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path='/'
          element={isAuthenticated ? <Navigate to="/dashboard" replace/> : <Navigate to="/login" replace/>}
        />
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>

        {/* PROTECTED ROUTES */}
        <Route element={ <ProtectedRoute /> }>
          <Route path='/dashboard' element={ <DashboardPage /> }/>
          <Route path='/documents' element={ <DocumentListPage /> }/>
          <Route path='/documents/:id' element={ <DocumentDetailPage /> }/>
          <Route path='/flashcards' element={ <FlashCardsListPage /> }/>
          <Route path='/documents/:id/flashcards' element={ <FlashCardPage /> }/>
          <Route path='/quizzes/:quizId' element={ <QuizTakePage /> }/>
          <Route path='/quizzes/:quizId/results' element={ <QuizResultPage /> }/>
          <Route path='/profile' element={ <ProfilePage /> }/>
          {/* ADDD THIS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
          <Route path='/semesters' element={ <BankQuestionsPage /> }/>
          <Route path='/semesters/:semesterNumber' element={<SemesterDetailsPage />} />
          <Route path='/semesters/:semesterNumber/:courseId/questionsBank' element={<CourseDetailsPage />} />
          <Route path='/semesters/:semesterNumber/:courseId/learning' element={<LearningPortalPage />} />
          <Route path='/semesters/:semesterNumber/:courseId/choice' element={<CourseChoicePage />} />
        </Route>

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App