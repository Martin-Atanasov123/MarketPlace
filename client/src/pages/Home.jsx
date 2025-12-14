import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { ArrowForward, Bolt, Security, Inventory } from '@mui/icons-material';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.light', py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" bgcolor="white" p={4} borderRadius={15} boxShadow={3}>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" >
              Buy & Sell Anything
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' , }}>
              Your trusted marketplace for electronics, vehicles, real estate, and more.
              Connect with buyers and sellers in your community.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/catalog"
                endIcon={<ArrowForward />}
              >
                Browse Catalog
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                component={Link} 
                to="/login"
              >
                Post Free 
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg"   sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Why Choose Us
        </Typography>
        <Grid container justifyContent="center" spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Bolt color="primary" sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Fast & Easy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Post your ad in minutes. No complicated forms or fees.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Security color="primary" sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Safe & Secure
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your privacy is protected. Deal directly with verified users.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Inventory color="primary" sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Wide Selection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find everything from electronics to real estate in one place.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.light', py: 8 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Join thousands of users buying and selling on MarketPlace
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/catalog"
            >
              Explore Products
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
