export const strings = {
  ar: {
    adhkar: 'الأذكار',
    todos: 'المهام',
    passwords: 'كلمات المرور',
    settings: 'الإعدادات',
    morning: 'أذكار الصباح',
    evening: 'أذكار المساء',
    remaining: 'المتبقي',
    times: 'مرات',
    addTodo: 'إضافة مهمة',
    addCategory: 'إضافة تصنيف',
    editCategory: 'تعديل تصنيف',
    deleteCategory: 'حذف تصنيف',
    addPassword: 'إضافة كلمة مرور',
    copyPassword: 'نسخ كلمة المرور',
    copyEmail: 'نسخ البريد الإلكتروني',
    language: 'اللغة',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',
  },
  en: {
    adhkar: 'Adhkar',
    todos: 'Tasks',
    passwords: 'Passwords',
    settings: 'Settings',
    morning: 'Morning Adhkar',
    evening: 'Evening Adhkar',
    remaining: 'Remaining',
    times: 'times',
    addTodo: 'Add Task',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    addPassword: 'Add Password',
    copyPassword: 'Copy Password',
    copyEmail: 'Copy Email',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  tr: {
    adhkar: 'Zikirler',
    todos: 'Görevler',
    passwords: 'Şifreler',
    settings: 'Ayarlar',
    morning: 'Sabah Zikirleri',
    evening: 'Akşam Zikirleri',
    remaining: 'Kalan',
    times: 'kez',
    addTodo: 'Görev Ekle',
    addCategory: 'Kategori Ekle',
    editCategory: 'Kategori Düzenle',
    deleteCategory: 'Kategori Sil',
    addPassword: 'Şifre Ekle',
    copyPassword: 'Şifreyi Kopyala',
    copyEmail: 'E-postayı Kopyala',
    language: 'Dil',
    theme: 'Tema',
    light: 'Açık',
    dark: 'Koyu',
    system: 'Sistem',
  },
};

export type Language = keyof typeof strings;
export type StringKey = keyof typeof strings.en;