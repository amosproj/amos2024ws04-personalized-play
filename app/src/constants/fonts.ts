export enum Fonts {
  InterLight = 'InterLight',
  InterRegular = 'InterRegular',
  InterSemiBold = 'InterSemiBold',
  InterBold = 'InterBold'
}

export const fontAssets = {
  [Fonts.InterLight]: require('../../assets/fonts/Inter-Light.ttf'),
  [Fonts.InterRegular]: require('../../assets/fonts/Inter-Regular.ttf'),
  [Fonts.InterSemiBold]: require('../../assets/fonts/Inter-SemiBold.ttf'),
  [Fonts.InterBold]: require('../../assets/fonts/Inter-Bold.ttf')
};
