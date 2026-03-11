/**
 * Test Water Image Validation
 * Use this utility to test your water images and see validation results
 */

import { validateWaterImage } from './waterImageValidator';

export async function testWaterImageFromUrl(imageUrl: string): Promise<void> {
  console.log(`🧪 Testing image: ${imageUrl}`);
  
  try {
    // Create image element
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Validate the image
    const result = await validateWaterImage(img);
    
    console.log('📊 Validation Result:');
    console.log(`   ✅ Is Water: ${result.isWater}`);
    console.log(`   📝 Reason: ${result.reason}`);
    
    if (result.isWater) {
      console.log('🎉 SUCCESS: This water image was accepted!');
    } else {
      console.log('❌ REJECTED: This image was not detected as water-related');
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

export async function testWaterImageFromFile(file: File): Promise<void> {
  console.log(`🧪 Testing file: ${file.name}`);
  
  try {
    // Create image element from file
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });

    // Validate the image
    const result = await validateWaterImage(img);
    
    console.log('📊 Validation Result:');
    console.log(`   ✅ Is Water: ${result.isWater}`);
    console.log(`   📝 Reason: ${result.reason}`);
    
    if (result.isWater) {
      console.log('🎉 SUCCESS: This water image was accepted!');
    } else {
      console.log('❌ REJECTED: This image was not detected as water-related');
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Usage examples:
// 1. Test with URL: testWaterImageFromUrl('https://example.com/water-image.jpg')
// 2. Test with file input: testWaterImageFromFile(file)
