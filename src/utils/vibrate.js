// 震动提醒函数
export const vibrate = () => {
    if ('vibrate' in navigator) {
      window.navigator.vibrate(100); // 震动 100 毫秒
    }
  };