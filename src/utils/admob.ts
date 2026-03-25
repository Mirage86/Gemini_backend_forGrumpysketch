import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Teszt hirdetés azonosító (Android)
// Élesítéskor cseréld le a saját AdMob Banner azonosítódra!
const BANNER_AD_ID = 'ca-app-pub-3940256099942544/6300978111';

export async function initializeAdMob() {
  if (!Capacitor.isNativePlatform()) {
    console.log('AdMob is only available on native platforms.');
    return;
  }
  
  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: true, // Teszteléshez igazra állítva
    });
    console.log('AdMob initialized');
  } catch (error) {
    console.error('Failed to initialize AdMob', error);
  }
}

export async function showBannerAd() {
  if (!Capacitor.isNativePlatform()) {
    console.log('Banner ad requested, but running on web.');
    return;
  }

  try {
    const options: BannerAdOptions = {
      adId: BANNER_AD_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true, // Teszteléshez igazra állítva
    };
    await AdMob.showBanner(options);
  } catch (error) {
    console.error('Failed to show banner ad', error);
  }
}

export async function hideBannerAd() {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.error('Failed to hide banner ad', error);
  }
}

export async function removeBannerAd() {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await AdMob.removeBanner();
  } catch (error) {
    console.error('Failed to remove banner ad', error);
  }
}
