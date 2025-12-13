import { Box, Typography, CardMedia } from '@mui/material';

/**
 * Reusable component for displaying listing images
 */
export const ListingImage = ({ 
  imageUrl, 
  alt = 'Listing image', 
  height = 250,
  borderRadius = 1
}) => {
  return (
    <CardMedia
      component="div"
      sx={{
        height,
        bgcolor: 'grey.200',
        borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt={alt}
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            borderRadius 
          }}
        />
      ) : (
        <Typography color="text.secondary">No image</Typography>
      )}
    </CardMedia>
  );
};

