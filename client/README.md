
## Custom Hooks

### `useListings`
Manages all listing-related operations.

**Functions:**
- `fetchListings()` - Fetch all listings
- `fetchListing(id)` - Fetch a single listing by ID
- `fetchMyListings()` - Fetch current user's listings
- `createListing(data)` - Create a new listing
- `updateListing(id, data)` - Update an existing listing
- `deleteListing(id)` - Delete a listing

**Returns:**
- `loading` - Boolean indicating loading state
- `error` - Error message if any
- All listing functions

**Edge Cases Handled:**
- Invalid IDs
- Missing authentication
- Network errors
- Invalid data formats
- 404/403 errors

### `useComments`
Manages comment operations for listings.

**Functions:**
- `fetchComments(listingId)` - Fetch comments for a listing
- `createComment(listingId, text)` - Create a new comment
- `deleteComment(commentId)` - Delete a comment

**Returns:**
- `loading` - Boolean indicating loading state
- `error` - Error message if any
- All comment functions

**Edge Cases Handled:**
- Invalid listing/comment IDs
- Missing authentication
- Empty comment text
- URL encoding for special characters

### `useToast`
Manages toast notifications throughout the application.

**Functions:**
- `showToast(message, severity)` - Show a toast notification
- `hideToast()` - Hide the current toast

**Returns:**
- `showToast` - Function to show toast
- `hideToast` - Function to hide toast
- `toast` - Current toast state object

**Usage:**
```jsx
const { showToast, hideToast, toast } = useToast();
showToast('Success message', 'success');
// In JSX:
<Toast toast={toast} onClose={hideToast} />
```

### `useImageUpload`
Handles image file uploads and previews.

**Functions:**
- `handleImageFile(file)` - Process an image file
- `handleImageUrl(url)` - Set image from URL
- `resetImage()` - Clear image preview

**Returns:**
- `imagePreview` - Base64 string or URL of preview
- `error` - Error message if any
- All image handling functions

**Edge Cases Handled:**
- File size validation (max 5MB)
- File type validation (images only)
- Empty files
- FileReader errors
- Aborted reads

### `useDeleteDialog`
Manages delete confirmation dialogs.

**Functions:**
- `openDialog(id)` - Open dialog with item ID
- `closeDialog()` - Close dialog

**Returns:**
- `isOpen` - Boolean indicating if dialog is open
- `itemId` - Current item ID
- `openDialog` - Function to open dialog
- `closeDialog` - Function to close dialog

### `useUser`
Manages user profile operations.

**Functions:**
- `updateEmail(email)` - Update user email
- `updatePassword(password)` - Update user password
- `validatePassword(password)` - Validate password strength

**Returns:**
- `loading` - Boolean indicating loading state
- `error` - Error message if any
- All user functions

## Reusable Components

### `Toast`
Displays toast notifications.

**Props:**
- `toast` - Toast state object with `open`, `message`, `severity`
- `onClose` - Callback when toast is closed

### `LoadingSpinner`
Displays a loading indicator.

**Props:**
- `message` - Optional loading message (default: "Loading...")

### `DeleteDialog`
Confirmation dialog for delete operations.

**Props:**
- `open` - Boolean to control visibility
- `onClose` - Callback when dialog is closed
- `onConfirm` - Callback when delete is confirmed
- `title` - Optional dialog title (default: "Delete Item")
- `message` - Optional dialog message

### `ListingImage`
Displays listing images with fallback.

**Props:**
- `imageUrl` - Image URL or base64 string
- `alt` - Alt text for image
- `height` - Image height (default: 200)
- `borderRadius` - Border radius (default: 0)

## Constants

### `LISTING_CATEGORIES`
Array of available listing categories:
- Electronics
- Vehicles
- Real Estate
- Furniture
- Clothing
- Other

### `MAX_IMAGE_SIZE`
Maximum image file size in bytes (5MB).

### `TOAST_DURATION`
Toast notification display duration in milliseconds (3000ms).

## Validation Utilities

### `validatePassword(password)`
Validates password strength.

**Returns:** Array of error messages (empty if valid)

**Requirements:**
- At least 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### `validateListingForm(formData)`
Validates listing form data.

**Returns:** `{ isValid: boolean, errors: string[] }`

**Validates:**
- Title is required
- Description is required
- Price is required and valid number (≥ 0)
- Category is required

## Error Handling

All hooks include comprehensive error handling:
- Network errors
- Invalid input validation
- Authentication errors
- Server errors (404, 403, 500)
- Data format validation

## Best Practices

1. **Always use hooks for data fetching** - Don't write fetch logic directly in components
2. **Use Toast for user feedback** - Consistent notification system
3. **Validate inputs** - Use validation utilities before API calls
4. **Handle loading states** - Show loading indicators during async operations
5. **Error boundaries** - Wrap routes in ErrorBoundary for error handling

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## API Endpoints

The application uses a REST API at `http://localhost:3030`:

- `GET /data/listings` - Get all listings
- `GET /data/listings/:id` - Get single listing
- `POST /data/listings` - Create listing
- `PUT /data/listings/:id` - Update listing
- `DELETE /data/listings/:id` - Delete listing
- `GET /data/comments?where=listingId="..."` - Get comments
- `POST /data/comments` - Create comment
- `DELETE /data/comments/:id` - Delete comment
- `GET /users/me` - Get current user
- `POST /users/login` - Login
- `POST /users/register` - Register

## License

MIT

