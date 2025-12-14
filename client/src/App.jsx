import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import ListingDetails from "./pages/ProductDetails";
import CreateListing from "./pages/CreatePost";
import MyListings from "./pages/MyListings";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

// Create a simple, clean Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Pink
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/listing/:id" element={<ListingDetails />} />
              <Route path="/create" element={<CreateListing />} />
              <Route path="/edit/:id" element={<CreateListing />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
