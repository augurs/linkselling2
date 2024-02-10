import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from './app/pages/auth/login.js'
import Thanks from './app/pages/auth/thankyou.js'
import Thanksarticle from './app/pages/auth/thankforarticle.js'
import SignUp from './app/pages/auth/signup.js'
import ForgotPassword from "./app/pages/auth/forgotPassword.js";
import Resubmnittedarticle from './app/pages/auth/resubmittedarticle.js'
import Portalarticledetails from './app/pages/auth/portalarticledetails.js'
import Portalarticleupdate from './app/pages/auth/portallinkupdatewithid.js'
import Requestarticledetails from './app/pages/auth/requestarticledetails.js'
import Requestarticleupdate from './app/pages/auth/requestarticlewithid.js'
import Uploadimagerequestarticle from './app/pages/auth/uploadrequestarticleimage.js'
import { useEffect } from "react";
import Home from "./app/pages/home.js";
import { ToastContainer } from "react-toastify";
import Nip from "./app/pages/auth/Nip.js";
import Header from "./app/Components/Header/header.js";
import Layout from "./app/Components/Layout/layout.js";
import PublisherLayout from "./app/Components/Layout/publisherLayout.js";
import ArticleList from "./app/pages/Content/ArticleList.js";
import ViewAddArticle from "./app/pages/Content/ViewAddArticle.js";
import AddArticle from "./app/pages/Content/AddArticle.js";
import OrderArticle from "./app/pages/Content/OrderArticle.js";
import ProjectList from "./app/pages/MyProjects/ProjectList.js";
import AddProjects from "./app/pages/MyProjects/AddProjects.js";
import EditProjects from "./app/pages/MyProjects/EditArticles.js";
import ArticleInProgress from "./app/pages/BuyLinks/ArticleInProgress.js";
import ArticleDetails from "./app/pages/Content/ArticleDetails.js";
import ReadyArticles from "./app/pages/BuyLinks/ReadyArticles.js";
import BuyArticles from "./app/pages/BuyLinks/BuyArticles.js";
// import Domaindetails from "./app/pages/BuyLinks/Domaindetails.js";
import CustomLanguageContext from "./app/Context/languageContext.js";
import RequestedArticles from "./app/pages/Content/RequestedArticles.js";
import Cart from "./app/pages/Cart/cart.js";
import MarketPlace from "./app/pages/MarketPlace/marketPlacList.js";
import Invoices from "./app/pages/Invoices/invoices.js";
import Companydata from "./app/pages/companydata/companydata.js";
import Orders from "./app/pages/Orders/Orders.js";
import CustomCartContext from "./app/Context/cartListContext.js";
import '../src/assets/css/custom.css'
import { SidebarProvider } from "./app/Context/togglerBarContext.js";
import VieworderArticle from "./app/pages/ViewOderArticle/vieworderArticle.js";
import NipDetails from "./app/pages/auth/nipDetails.js";
import { WalletProvider } from "./app/Context/walletContext.js";

//publisher pages 
import PublisherSignUp from './app/pages/publisherPages/Auth/publisherSignUp.js'
import PublisherLogin from './app/pages/publisherPages/Auth/publisherLogin.js'
import PublisherDashboard from "./app/pages/publisherPages/Dashboard/dashboard.js";
import PublisherPublications from "./app/pages/publisherPages/Publications/publications.js";
import PublisherMyDomains from "./app/pages/publisherPages/MyDomains/listDomain.js";
import PublisherMyOffer from "./app/pages/publisherPages/MyDomains/myOffer.js";
import PublisherAddDomain from "./app/pages/publisherPages/MyDomains/addDomain.js";
import PublisherlistOffer from "./app/pages/publisherPages/MyDomains/listOffer.js";
import UpdateOffer from "./app/pages/publisherPages/MyDomains/updateOffer.js";
import ViewOffer from "./app/pages/publisherPages/MyDomains/viewOffer.js";









function App() {

  // const checkForDevTools = () => {
  //   // Check if window.devtools is defined and has the isOpen property
  //   if (window.devtools && typeof window.devtools.isOpen !== 'undefined') {
  //     if (window.devtools.isOpen) {
  //       alert("Please close the developer tools and refresh the page.");
  //       window.location.reload();
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const intervalId = setInterval(checkForDevTools, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  // useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };

  //   const handleKeyDown = (e) => {
  //     if (e.key === 'F12' || (e.ctrlKey && e.key === 'Shift' && e.keyCode === 73)) {
  //       console.warn("Developer Tools are not allowed.");
  //       e.preventDefault();
  //     }
  //   };

  //   const handleDevToolsChange = () => {
  //     if (window.devtools.isOpen) {
  //       console.warn("Developer Tools are not allowed.");
  //     }
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu);
  //   document.addEventListener('keydown', handleKeyDown);


  //   window.addEventListener('devtoolschange', handleDevToolsChange);

  //   return function cleanup() {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //     document.removeEventListener('keydown', handleKeyDown);
  //     window.removeEventListener('devtoolschange', handleDevToolsChange);
  //   };
  // }, []);


  const browserRouter = createBrowserRouter([
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/RegistrationDone',
      element: <Thanks />
    },
    {
      path: '/thanksPage',
      element: <Thanksarticle />
    },
    {
      path: '/signUp',
      element: <SignUp />
    },
    {
      path: '/signUp/publisher',
      element: <PublisherSignUp />
    },
    {
      path: '/login/publisher',
      element: <PublisherLogin />
    },
    {
      path: '/forgotpassword',
      element: <ForgotPassword />
    },{
      path: '/portalarticledetail/:id/',
      element: <Portalarticledetails />
    },
    { path: '/portalarticledetails/:id', element: <Portalarticleupdate /> },
    {
      path: '/requestarticledetail/requestarticle/:id/',
      element: <Requestarticledetails />
    },
    {
      path: '/nipDetails',
      element: <NipDetails />
    },
    { path: '/requestarticledetails/requestarticle/:id', element: <Requestarticleupdate /> },
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'articleList', element: <ArticleList /> },
        { path: 'addArticle', element: <AddArticle /> },
        { path: 'orderArticle', element: <OrderArticle /> },
        { path: 'projectList', element: <ProjectList /> },
        { path: 'addProject', element: <AddProjects /> },
        { path: 'editProject/:id', element: <EditProjects /> },
        // { path: 'marketPlace', element: <MarketPlace /> },
        { path: 'articlesInProgress', element: <ArticleInProgress /> },
        { path: 'articleDetails', element: <ArticleDetails /> },
        { path: 'readyArticles', element: <ReadyArticles /> },
        { path: 'buyArticles', element: <BuyArticles /> },
        { path: 'requestedArticles', element: <RequestedArticles /> },
        { path: 'cart', element: <Cart /> },
        { path: 'invoices', element: <Invoices /> },
        { path: 'companydata', element: <Companydata /> },
        { path: 'orders', element: <Orders /> },
        // { path: 'DomainDetails', element: <Domaindetails /> },
        { path: 'viewArticle/:articleid/:id', element: <VieworderArticle /> },
        { path: 'viewAddArticle/:id', element: <ViewAddArticle /> },
        { path: 'uploadimagerequestarticle/:id', element: <Uploadimagerequestarticle /> },
        {
          path: '/resubmitarticle/:id',
          element: <Resubmnittedarticle />
        },

      ]
    },
    {

      path: '/nip/:id',
      element: <Nip />

    },

    //---------------publisher pages router--------------------------
    {
      path: "/publisher",
      element: <PublisherLayout />,
      children: [
        { index: true, element: <PublisherDashboard /> },
        { path: '/publisher/listDomain', element: <PublisherMyDomains /> },
        { path: '/publisher/myOffer/:domainId', element: <PublisherMyOffer /> },
        { path: '/publisher/publications', element: <PublisherPublications /> },
        { path: '/publisher/addDomain', element: <PublisherAddDomain /> },
        { path: '/publisher/listOffer', element: <PublisherlistOffer /> },
        { path: '/publisher/updateOffer/:domainId', element: <UpdateOffer /> },
        { path: '/publisher/viewOffer', element: <ViewOffer /> },


      ]
    },
  ])

  return (
    <div>
      <SidebarProvider>
        <CustomCartContext>
          <CustomLanguageContext>
            <WalletProvider >
            <RouterProvider router={browserRouter} />
            </WalletProvider>
          </CustomLanguageContext>
        </CustomCartContext>
      </SidebarProvider>
    </div>
  );
}

export default App;
