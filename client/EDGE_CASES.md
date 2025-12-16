# Edge Cases & Error Handling Documentation

This document outlines all edge cases handled in the application and the improvements made for robustness.

## Fixed Issues

### 1. TypeScript/ESLint Errors
- ✅ Fixed `require()` import in `tailwind.config.ts` - converted to ES6 import
- ✅ Fixed missing type declarations for tailwindcss modules
- ✅ Removed duplicate `showToast` function in CreateListing.jsx
- ✅ Removed unused `categories` variable

## Edge Cases Handled

### useListings Hook

#### fetchListing
- ✅ **Invalid ID**: Validates ID is a string and not empty
- ✅ **404 Error**: Returns specific "Listing not found" message
- ✅ **Invalid Data**: Validates response has `_id` field
- ✅ **Network Errors**: Catches and re-throws with descriptive messages
- ✅ **Empty Response**: Validates data exists before processing

#### fetchListings
- ✅ **Non-Array Response**: Returns empty array if response is not an array
- ✅ **Missing Likes**: Initializes likes array if missing
- ✅ **Network Errors**: Handles fetch failures gracefully

#### fetchMyListings
- ✅ **No User**: Throws error if user is not authenticated
- ✅ **Empty Results**: Returns empty array if no listings found
- ✅ **Non-Array Response**: Ensures array is returned

#### createListing
- ✅ **No User**: Validates user authentication
- ✅ **Invalid Data**: Validates data is an object
- ✅ **Missing Title**: Validates title exists and is not empty
- ✅ **Missing Description**: Validates description exists and is not empty
- ✅ **Invalid Price**: Validates price is a number and not negative
- ✅ **Empty Category**: Defaults to 'Other' if missing
- ✅ **401/403 Errors**: Handles authentication/authorization errors
- ✅ **String Trimming**: Trims whitespace from text fields

#### updateListing
- ✅ **Invalid ID**: Validates ID is a string
- ✅ **No User**: Validates user authentication
- ✅ **Invalid Data**: Validates data is an object
- ✅ **All createListing validations**: Same validation as create
- ✅ **Likes Array**: Ensures likes is always an array

#### deleteListing
- ✅ **Invalid ID**: Validates ID is a string
- ✅ **No User**: Validates user authentication
- ✅ **404 Error**: Returns "Listing not found" message
- ✅ **403 Error**: Returns permission denied message
- ✅ **Network Errors**: Handles fetch failures

### useComments Hook

#### fetchComments
- ✅ **Invalid Listing ID**: Returns empty array with warning
- ✅ **404 Error**: Returns empty array (comments may not exist)
- ✅ **URL Encoding**: Properly encodes listing ID in URL
- ✅ **Non-Array Response**: Ensures array is returned
- ✅ **Network Errors**: Returns empty array on error (non-critical)

#### createComment
- ✅ **No User**: Validates user authentication
- ✅ **Invalid Listing ID**: Validates ID is a string
- ✅ **Empty Text**: Validates text exists and is not empty
- ✅ **Whitespace Only**: Trims and validates text
- ✅ **Type Validation**: Ensures text is a string

#### deleteComment
- ✅ **Invalid Comment ID**: Validates ID is a string
- ✅ **No User**: Validates user authentication
- ✅ **404 Error**: Returns "Comment not found" message
- ✅ **403 Error**: Returns permission denied message

### useImageUpload Hook

#### handleImageFile
- ✅ **No File**: Returns resolved promise with null
- ✅ **Invalid File Type**: Validates file is an image
- ✅ **File Size**: Validates file size is under 5MB
- ✅ **Empty File**: Validates file size is not 0
- ✅ **FileReader Errors**: Handles read errors
- ✅ **Aborted Reads**: Handles aborted file reads
- ✅ **Invalid Base64**: Validates base64 string is valid
- ✅ **Promise Rejection**: Properly rejects on errors

#### handleImageUrl
- ✅ **Null/Undefined URL**: Sets empty string
- ✅ **Invalid URL**: Accepts any string (validation in component)

### useToast Hook

- ✅ **State Management**: Properly manages toast state
- ✅ **Callback Stability**: Uses useCallback for stable references
- ✅ **Default Severity**: Defaults to 'success' if not specified

### useDeleteDialog Hook

- ✅ **State Management**: Properly manages dialog state
- ✅ **ID Management**: Tracks item ID separately
- ✅ **Cleanup**: Resets state on close

### Validation Utilities

#### validatePassword
- ✅ **Null/Undefined**: Handles missing password
- ✅ **Length**: Validates minimum 6 characters
- ✅ **Uppercase**: Validates uppercase letter exists
- ✅ **Lowercase**: Validates lowercase letter exists
- ✅ **Number**: Validates number exists
- ✅ **Empty String**: Handles empty strings

#### validateListingForm
- ✅ **Null/Undefined FormData**: Returns invalid with error
- ✅ **Invalid Type**: Validates formData is an object
- ✅ **Title Validation**: 
  - Required
  - Must be string
  - Must not be empty
  - Max 200 characters
- ✅ **Description Validation**:
  - Required
  - Must be string
  - Must not be empty
  - Max 5000 characters
- ✅ **Price Validation**:
  - Required
  - Must be valid number
  - Cannot be negative
  - Max 1 billion
- ✅ **Category Validation**:
  - Required
  - Must be string

### Components

#### Toast
- ✅ **Props Validation**: Handles missing props gracefully
- ✅ **Auto-close**: Closes after duration
- ✅ **Manual Close**: Supports manual close

#### LoadingSpinner
- ✅ **Default Message**: Provides default message
- ✅ **Custom Message**: Supports custom messages

#### DeleteDialog
- ✅ **Optional Props**: All props except open/onClose are optional
- ✅ **Default Messages**: Provides default title and message

#### ListingImage
- ✅ **Missing Image**: Shows "No image" placeholder
- ✅ **Invalid URL**: Handles broken image URLs
- ✅ **Custom Dimensions**: Supports custom height and borderRadius

### Pages

#### CreateListing
- ✅ **No User**: Redirects to login
- ✅ **Invalid Listing ID**: Handles gracefully
- ✅ **Permission Check**: Validates ownership before editing
- ✅ **Form Validation**: Validates before submission
- ✅ **Image Upload Errors**: Handles file errors
- ✅ **Network Errors**: Shows appropriate error messages
- ✅ **Authentication Errors**: Redirects to login on 401/403
- ✅ **Missing Data**: Handles missing fields in loaded listing

#### ListingDetails
- ✅ **Invalid ID**: Handles gracefully
- ✅ **404 Error**: Shows not found message
- ✅ **No Comments**: Shows empty state
- ✅ **Permission Checks**: Validates ownership for delete

#### Catalog
- ✅ **Empty Listings**: Shows empty state
- ✅ **Filter Edge Cases**: Handles empty search/category
- ✅ **Pagination**: Handles edge cases in pagination

## Error Messages

All error messages are user-friendly and descriptive:
- Network errors: "Failed to [action]. Please check your connection."
- Validation errors: Specific field requirements
- Permission errors: "You do not have permission..."
- Not found errors: "[Resource] not found"
- Authentication errors: "Please login to..."

## Testing Recommendations

### Manual Testing Checklist

1. **Network Failures**
   - [ ] Test with server offline
   - [ ] Test with slow network
   - [ ] Test with timeout

2. **Invalid Inputs**
   - [ ] Empty strings
   - [ ] Null/undefined values
   - [ ] Invalid types
   - [ ] Extremely long strings
   - [ ] Special characters

3. **Authentication**
   - [ ] Expired tokens
   - [ ] Missing tokens
   - [ ] Invalid tokens

4. **Permissions**
   - [ ] Edit others' listings
   - [ ] Delete others' comments
   - [ ] Access without login

5. **File Uploads**
   - [ ] Large files (>5MB)
   - [ ] Non-image files
   - [ ] Corrupted files
   - [ ] Empty files

6. **Edge Values**
   - [ ] Price = 0
   - [ ] Price = negative
   - [ ] Very large prices
   - [ ] Empty arrays
   - [ ] Missing properties

## Performance Considerations

- ✅ All hooks use `useCallback` to prevent unnecessary re-renders
- ✅ Loading states prevent duplicate requests
- ✅ Error states prevent infinite retry loops
- ✅ Validation happens before API calls

## Security Considerations

- ✅ Input sanitization (trimming, type checking)
- ✅ Authentication checks before operations
- ✅ Permission validation on server operations
- ✅ URL encoding for special characters
- ✅ File type validation
- ✅ File size limits

