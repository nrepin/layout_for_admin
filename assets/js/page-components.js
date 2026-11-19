document.addEventListener("alpine:init", () => {
  Alpine.data("adminFormMultiSelect", () => ({
        isOpen: false,
        selected: ['Синий', 'Зелёный'],
        options: ['Синий', 'Зелёный', 'Красный', 'Жёлтый', 'Фиолетовый', 'Оранжевый'],
        toggle(option) {
          if (this.selected.includes(option)) {
            this.selected = this.selected.filter(item => item !== option);
          } else {
            this.selected.push(option);
          }
        },
        remove(option) {
          this.selected = this.selected.filter(item => item !== option);
        }
      }));

  Alpine.data("adminFormCombobox", () => ({
        isOpen: false,
        search: '',
        selected: '',
        items: ['Next.js', 'React', 'Vue.js', 'Svelte', 'Angular', 'Nuxt.js', 'Remix', 'Astro', 'Gatsby'],
        get filteredItems() {
          if (!this.search) return this.items;
          return this.items.filter(item => item.toLowerCase().includes(this.search.toLowerCase()));
        },
        selectItem(item) {
          this.selected = item;
          this.search = item;
          this.isOpen = false;
        },
        clear() {
          this.selected = '';
          this.search = '';
        }
      }));

  Alpine.data("adminFormCopyField", () => ({
        value: 'www.example.com',
        copied: false,
        async copy() {
          try {
            await navigator.clipboard.writeText(this.value);
            this.copied = true;
            setTimeout(() => this.copied = false, 2000);
          } catch (e) {
            console.error(e);
          }
        }
      }));

  Alpine.data("adminFormImageUpload", () => ({
      files: [],
      destroy() { this.clearAll(); },
      isDragActive: false,
      isPreviewOpen: false,
      previewFile: null,
      handleFiles(fileList) {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          if (file.type.startsWith('image/')) {
            const preview = URL.createObjectURL(file);
            this.files.push({
              name: file.name,
              size: file.size,
              preview: preview
            });
          }
        }
      },
      handleDrop(e) {
        this.isDragActive = false;
        if (e.dataTransfer && e.dataTransfer.files) {
          this.handleFiles(e.dataTransfer.files);
        }
      },
      removeFile(index) {
        if (this.files[index] && this.files[index].preview) {
          URL.revokeObjectURL(this.files[index].preview);
        }
        this.files.splice(index, 1);
      },
      clearAll() {
        this.files.forEach(f => {
          if (f.preview) URL.revokeObjectURL(f.preview);
        });
        this.files = [];
      },
      openPreview(file) {
        this.previewFile = file;
        this.isPreviewOpen = true;
      },
      formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      }
    }));

  Alpine.data("adminProfileDetails", () => ({
    profileData: {
      avatarUrl: './assets/images/owner.png',
      fullName: 'Смирнов Алексей Сергеевич',
      patronymic: 'Сергеевич',
      role: 'Разработчик',
      location: 'Россия, Москва',
      firstName: 'Алексей',
      lastName: 'Смирнов',
      email: 'smirnov@yandex.ru',
      phone: '+7 (900) 123-45-62',
      bio: 'Разработчик',
      socialLinks: {
        facebook: '',
        x: '',
        linkedin: '',
        instagram: ''
      }
    },
    isDialogOpen: false,
    editForm: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      socialLinks: {
        facebook: '',
        x: '',
        linkedin: '',
        instagram: ''
      }
    },
    avatarPreview: null,
    avatarUrls: [],
    destroy() {
      this.avatarUrls.forEach(url => URL.revokeObjectURL(url));
    },
    init() {
      this.resetEditForm();
    },
    resetEditForm() {
      this.editForm = JSON.parse(JSON.stringify(this.profileData));
      this.avatarPreview = this.profileData.avatarUrl;
    },
    openEditDialog() {
      this.resetEditForm();
      this.isDialogOpen = true;
    },
    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.avatarPreview = URL.createObjectURL(file);
        this.avatarUrls.push(this.avatarPreview);
      }
    },
    saveChanges() {
      this.profileData.firstName = this.editForm.firstName;
      this.profileData.lastName = this.editForm.lastName;
      this.profileData.fullName = [this.editForm.lastName, this.editForm.firstName, this.profileData.patronymic].filter(Boolean).join(' ');
      this.profileData.email = this.editForm.email;
      this.profileData.phone = this.editForm.phone;
      this.profileData.bio = this.editForm.bio;
      this.profileData.socialLinks = JSON.parse(JSON.stringify(this.editForm.socialLinks));
      if (this.avatarPreview) {
        this.profileData.avatarUrl = this.avatarPreview;
      }
      this.isDialogOpen = false;
    }
  }));

  Alpine.data("adminProfileAddress", () => ({
    address: {
      country: 'Россия',
      cityState: 'Москва',
      postalCode: '101000',
      taxId: 'AS4568384'
    },
    isModalOpen: false,
    editForm: {
      country: '',
      cityState: '',
      postalCode: '',
      taxId: ''
    },
    openModal() {
      this.editForm = JSON.parse(JSON.stringify(this.address));
      this.isModalOpen = true;
    },
    saveAddress() {
      this.address = JSON.parse(JSON.stringify(this.editForm));
      this.isModalOpen = false;
    }
  }));

  Alpine.data("adminProfileSecurity", () => ({
    isPasswordModalOpen: false,
    twoFactorEnabled: false,
    passwordForm: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    openPasswordModal() {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.isPasswordModalOpen = true;
    },
    savePassword() {
      this.isPasswordModalOpen = false;
    }
  }));
});

document.addEventListener("alpine:init", () => {
  Alpine.data("adminFileManager1", () => ({
    folders: [
      { id: 'images', title: 'Изображения', fileCount: '345', size: '26.40 ГБ' },
      { id: 'documents', title: 'Документы', fileCount: '130', size: '26.40 ГБ' },
      { id: 'apps', title: 'Приложения', fileCount: '130', size: '26.40 ГБ' },
      { id: 'downloads', title: 'Загрузки', fileCount: '345', size: '26.40 ГБ' }
    ]
  }));

  Alpine.data("adminFileManager2", () => ({
    files: [
      { id: '1', fileName: 'Video_947954.mp4', iconLight: './assets/icons/files/file-video.svg', iconDark: './assets/icons/files/file-video-dark.svg', category: 'Видео', size: '89 МБ', dateModified: '12 января 2027 г.' },
      { id: '2', fileName: 'Travel.jpg', iconLight: './assets/icons/files/file-image.svg', iconDark: './assets/icons/files/file-image-dark.svg', category: 'Изображение', size: '5.4 МБ', dateModified: '10 февраля 2027 г.' },
      { id: '3', fileName: 'Document.pdf', iconLight: './assets/icons/files/file-pdf.svg', iconDark: './assets/icons/files/file-pdf-dark.svg', category: 'Документ', size: '1.2 МБ', dateModified: '8 марта 2027 г.' },
      { id: '4', fileName: 'Video_947954_028.mp4', iconLight: './assets/icons/files/file-video.svg', iconDark: './assets/icons/files/file-video-dark.svg', category: 'Видео', size: '489 МБ', dateModified: '29 апреля 2027 г.' },
      { id: '5', fileName: 'Mountain.png', iconLight: './assets/icons/files/file-image.svg', iconDark: './assets/icons/files/file-image-dark.svg', category: 'Изображение', size: '5.4 МБ', dateModified: '10 февраля 2027 г.' },
      { id: '6', fileName: 'CV.pdf', iconLight: './assets/icons/files/file-pdf.svg', iconDark: './assets/icons/files/file-pdf-dark.svg', category: 'Документ', size: '1.2 МБ', dateModified: '8 марта 2027 г.' }
    ],
    deleteFile(id) {
      this.files = this.files.filter(f => f.id !== id);
    }
  }));

  Alpine.data("adminPricing3", () => ({ cardTitle: 'Месячные и годовые тарифы' }));

  Alpine.data("adminPricing4", () => ({ monthly: true }));

  Alpine.data("adminPricing5", () => ({ cardTitle: 'Бессрочные тарифы' }));

  Alpine.data("adminPricing6", () => ({ cardTitle: 'Тарифы для команд' }));

  Alpine.data("adminFaq7", () => ({ cardTitle: 'Частые вопросы' }));

  Alpine.data("adminFaq8", () => ({ openItem: 0 }));

  Alpine.data("adminFaq9", () => ({ cardTitle: 'Вопросы о тарифах' }));

  Alpine.data("adminFaq10", () => ({ openItem: null }));

  Alpine.data("adminFaq11", () => ({ cardTitle: 'Вопросы о возможностях' }));

  Alpine.data("adminFaq12", () => ({ openItem: 0 }));
});

document.addEventListener("alpine:init", () => {
  Alpine.data("adminImported1", () => ({
    keys: [
      {
        id: '1',
        name: 'Основной API-ключ',
        value: 'sk_live_**********4248',
        status: 'Отключён',
        created: '25 января 2025 г.',
        lastUsed: 'Сегодня, 10:45',
        copied: false
      },
      {
        id: '2',
        name: 'API-ключ для разработки',
        value: 'dev_live_**********4923',
        status: 'Активен',
        created: '29 декабря 2024 г.',
        lastUsed: 'Сегодня, 00:40',
        copied: false
      },
      {
        id: '3',
        name: 'Архивный API-ключ',
        value: 'leg_live_**********0932',
        status: 'Активен',
        created: '12 марта 2024 г.',
        lastUsed: 'Сегодня, 23:45',
        copied: false
      }
    ],
    isDialogOpen: false,
    newAppName: 'Saasbold',
    async copyKey(item) {
      try { await navigator.clipboard.writeText(item.value); } catch { return; }
      item.copied = true;
      setTimeout(() => { item.copied = false; }, 1500);
    },
    regenerateKey(item) {
      const prefix = item.value.split('_')[0] || 'sk';
      const randomHex = Math.floor(1000 + Math.random() * 9000);
      item.value = prefix + '_live_**********' + randomHex;
    },
    toggleStatus(item) {
      item.status = item.status === 'Активен' ? 'Отключён' : 'Активен';
    },
    deleteKey(id) {
      this.keys = this.keys.filter(k => k.id !== id);
    },
    addKey() {
      if (!this.newAppName.trim()) return;
      const randomHex = Math.floor(1000 + Math.random() * 9000);
      this.keys.unshift({
        id: String(Date.now()),
        name: this.newAppName.trim(),
        value: 'sk_live_**********' + randomHex,
        status: 'Активен',
        created: 'Только что',
        lastUsed: 'Никогда',
        copied: false
      });
      this.newAppName = 'Saasbold';
      this.isDialogOpen = false;
    }
  }));

  Alpine.data("adminImported2", () => ({
    pageTitle: 'Интеграции',
    isAddModalOpen: false,
    isSettingsModalOpen: false,
    isDetailsModalOpen: false,
    isDeleteModalOpen: false,
    deletedIntegrations: [],
    customIntegrations: [],
    selectedIntegration: {
      id: '',
      title: '',
      appName: '',
      clientId: '',
      clientSecret: '',
      authBaseUri: ''
    },
    newIntegration: {
      app: 'Google Meet',
      clientId: '',
      clientSecret: '',
      authBaseUri: ''
    },
    openSettings(item) {
      this.selectedIntegration = { ...item };
      this.isSettingsModalOpen = true;
    },
    saveSettings() {
      this.isSettingsModalOpen = false;
    },
    openDetails(item) {
      this.selectedIntegration = { ...item };
      this.isDetailsModalOpen = true;
    },
    openDelete(item) {
      this.selectedIntegration = { ...item };
      this.isDeleteModalOpen = true;
    },
    confirmDelete() {
      if (this.selectedIntegration && this.selectedIntegration.id) {
        this.deletedIntegrations.push(this.selectedIntegration.id);
        this.customIntegrations = this.customIntegrations.filter(i => i.id !== this.selectedIntegration.id);
      }
      this.isDeleteModalOpen = false;
    },
    addIntegration() {
      if (!this.newIntegration.app) return;
      this.customIntegrations.unshift({
        id: 'custom-' + Date.now(),
        title: this.newIntegration.app,
        appName: this.newIntegration.app + ' Workspace',
        description: 'Подключено' + this.newIntegration.app + ' integration for your team workspace.',
        clientId: this.newIntegration.clientId || 'Не указано',
        clientSecret: this.newIntegration.clientSecret || 'Не указано',
        authBaseUri: this.newIntegration.authBaseUri || 'Не указано',
        connect: true
      });
      this.newIntegration = { app: 'Google Meet', clientId: '', clientSecret: '', authBaseUri: '' };
      this.isAddModalOpen = false;
    }
  }));

  Alpine.data("adminImported3", () => ({ connected: true }));

  Alpine.data("adminImported4", () => ({ connected: true }));

  Alpine.data("adminImported5", () => ({ connected: false }));

  Alpine.data("adminImported6", () => ({ connected: false }));

  Alpine.data("adminImported7", () => ({ connected: false }));

  Alpine.data("adminImported8", () => ({ connected: false }));

  Alpine.data("adminImported9", () => ({ connected: false }));

  Alpine.data("adminImported10", () => ({ connected: true }));

  Alpine.data("adminImported11", () => ({ connected: false }));
});

document.addEventListener("alpine:init", () => {
  Alpine.data("adminAiCalendar1", () => ({
    chatTitle: 'Адаптивная форма входа',
    isStarred: false,
    chatDropdown: false,
    shareModal: false,
    renameModal: false
  }));

  Alpine.data("adminAiCalendar2", () => ({ copied: false, shareUrl: window.location.href }));

  Alpine.data("adminAiCalendar3", () => ({ editing: false, copied: false, text: 'Напиши небольшой творческий текст для примера. Он будет временно заполнять свободное место в макете.', draft: '' }));

  Alpine.data("adminAiCalendar4", () => ({
      copied: false,
      liked: false,
      disliked: false,
      text: 'Алексей создаёт технологические проекты и объединяет возможности ИИ с новыми идеями. Он стремится сделать современные технологии доступными и полезными людям.'
    }));

  Alpine.data("adminAiCalendar5", () => ({
      copied: false,
      liked: false,
      disliked: false,
      text: 'Мария развивает городские экологические проекты и помогает формировать полезные привычки. Она верит, что небольшие ежедневные действия делают город чище и удобнее.'
    }));

  Alpine.data("adminAiCalendar6", () => ({
    promptText: '',
    selectedModel: 'Claude Sonnet 4.6',
    webSearch: true,
    deepSearch: false,
    plusDropdown: false,
    modelDropdown: false,
    submit() {
      if (!this.promptText.trim()) return;
      this.promptText = '';
    }
  }));

  Alpine.data("adminAiCalendar7", () => ({
    chatTitle: 'Адаптивная форма входа',
    isStarred: false,
    chatDropdown: false,
    shareModal: false,
    renameModal: false
  }));

  Alpine.data("adminAiCalendar8", () => ({ copied: false, shareUrl: window.location.href }));

  Alpine.data("adminAiCalendar9", () => ({ copied: false }));

  Alpine.data("adminAiCalendar10", () => ({
    promptText: '',
    selectedModel: 'Nano Banana Pro',
    aspectRatio: '3:4',
    imageCount: 2,
    resolution: '1K',
    modelDropdown: false,
    ratioDropdown: false,
    countDropdown: false,
    resDropdown: false,
    submit() {
      if (!this.promptText.trim()) return;
      this.promptText = '';
    }
  }));

  Alpine.data("adminAiCalendar11", () => ({ eventLevel: 'Primary' }));
});
