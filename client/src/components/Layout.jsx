import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
} from "@mui/material";
import Footer from "./Footer";

import {
    Home as HomeIcon,
    ViewList,
    Add,
    Person,
    Favorite,
    Logout,
    ShoppingCart,
    Store,
} from "@mui/icons-material";

export const Layout = ({ children }) => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <AppBar position="sticky">
                <Toolbar>
                    <Store sx={{ mr: 1 }} />
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        Market Place
                    </Typography>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                        startIcon={<HomeIcon />}
                    >
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/catalog"
                        startIcon={<ViewList />}
                    >
                        Catalog
                    </Button>

                    {isAuthenticated ? (
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                component={Link}
                                to="/create"
                                startIcon={<Add />}
                                sx={{ mx: 1 }}
                            >
                                Sell
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/my-listings"
                                startIcon={<ShoppingCart />}
                            >
                                My Product
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/favorites"
                                startIcon={<Favorite />}
                            >
                                Favorites
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/profile"
                                startIcon={<Person />}
                            >
                                Profile
                            </Button>
                            <Button
                                color="inherit"
                                onClick={logout}
                                startIcon={<Logout />}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            color="secondary"
                            component={Link}
                            to="/login"
                            startIcon={<Person />}
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>

            {/* this is footer with internal css */}
            <Footer/>


        </Box>
    );
};
