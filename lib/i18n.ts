import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Exterior Workshop": "Exterior Workshop",
      "Persona Engine": "Persona Engine",
      "Health Data": "Health Data",
      "Motion Hub": "Motion Hub",
      "Admin Console": "Admin Console",
      "System Settings": "System Settings",
      "Family Overview": "Family Overview",
      "Monitoring": "Monitoring {{count}} active HabitPod cores.",
      "Logout": "Logout",
      "About HabitPod": "About HabitPod",
      "About Desc": "HabitPod is an innovative ecosystem combining <1>AIGC, IoT Hardware, Art Toys, and Digital Health</1>. We transform the snacking experience by allowing users to generate custom 3D shells (AIGC), engage with distinct AI personalities (Persona Engine), and unlock treats through physical activity (Motion-to-Earn).",
      "Total Snacks Avoided": "Total Snacks Avoided",
      "Active Time (Today)": "Active Time (Today)",
      "Top Active User": "Top Active User",
      "Device Status": "Device Status",
      "Bind New Core": "Bind New Core",
      "Live AI Scans": "Live AI Scans",
      "Live": "Live",
      "No scan records": "No scan records",
      "Estimated Calories": "Estimated Calories:",
      "Manage": "Manage",
      "Calories": "Calories",
      "Blocked": "Blocked",
      "from last week": "from last week",
      "Excellent posture detected": "Excellent posture detected",
      "Strict Coach Mode": "Strict Coach Mode",
      "Camera error": "Cannot access camera. Please ensure permissions are granted.",
      "Recognition failed": "Recognition or saving failed, please try again.",
      "AI Vision Scanner": "AI Vision Scanner",
      "Turn on camera to detect": "Turn on camera to detect food or objects",
      "Turn on Camera": "Turn on Camera",
      "Gemini is analyzing": "Gemini is analyzing...",
      "Close": "Close",
      "Processing": "Processing...",
      "Capture and Analyze": "Capture and Analyze",
      "Health Score": "Health Score:",
      "Estimated Calories": "Estimated Calories",
      "Synced to cloud": "Synced to cloud",
      "Welcome to HabitPod": "Welcome to HabitPod",
      "Email": "Email",
      "Password": "Password",
      "Logging in": "Logging in...",
      "Login": "Login",
      "No account": "Don't have an account? ",
      "Register": "Register",
      "Create an Account": "Create an Account",
      "Registering": "Registering...",
      "Already have an account": "Already have an account? "
    }
  },
  zh: {
    translation: {
      "Dashboard": "控制台",
      "Exterior Workshop": "外观工厂",
      "Persona Engine": "系统人格",
      "Health Data": "健康数据",
      "Motion Hub": "运动中心",
      "Admin Console": "管理控制台",
      "System Settings": "系统设置",
      "Family Overview": "家庭概览",
      "Monitoring": "正在监控 {{count}} 个活跃的 HabitPod 核心。",
      "Logout": "退出登录",
      "About HabitPod": "关于 HabitPod",
      "About Desc": "HabitPod 是一个融合了 <1>AIGC、物联网硬件、潮玩和数字健康</1> 的创新生态系统。我们通过允许用户生成定制3D外壳（AIGC）、与独特AI人格交互（系统人格）以及通过体育活动解锁零食（运动赚取功能），彻底改变零食体验。",
      "Total Snacks Avoided": "累计避免的零食数",
      "Active Time (Today)": "活跃时间 (今日)",
      "Top Active User": "最活跃用户",
      "Device Status": "设备状态",
      "Bind New Core": "绑定新核心",
      "Live AI Scans": "实时 AI 扫描记录",
      "Live": "实时",
      "No scan records": "暂无扫描记录",
      "Estimated Calories": "预估热量:",
      "Manage": "管理",
      "Calories": "卡路里",
      "Blocked": "已拦截",
      "from last week": "较上周",
      "Excellent posture detected": "检测到优秀的体态",
      "Strict Coach Mode": "严格教练模式",
      "Camera error": "无法访问摄像头，请确保已授予权限。",
      "Recognition failed": "识别或保存失败，请重试。",
      "AI Vision Scanner": "AI 智能视觉扫描",
      "Turn on camera to detect": "开启摄像头以识别食物或物品",
      "Turn on Camera": "开启摄像头",
      "Gemini is analyzing": "Gemini 正在分析中...",
      "Close": "关闭",
      "Processing": "处理中...",
      "Capture and Analyze": "拍照并分析",
      "Health Score": "健康分:",
      "Estimated Calories": "预估热量",
      "Synced to cloud": "已同步至云端",
      "Welcome to HabitPod": "欢迎来到 HabitPod",
      "Email": "邮箱",
      "Password": "密码",
      "Logging in": "登录中...",
      "Login": "登录",
      "No account": "还没有账号？",
      "Register": "注册",
      "Create an Account": "创建账号",
      "Registering": "注册中...",
      "Already have an account": "已经有账号了？"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // default language
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
