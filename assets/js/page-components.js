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
      fullName: 'Алексей Смирнов',
      role: 'Разработчик',
      location: 'Россия, Москва',
      firstName: 'Алексей',
      lastName: 'Смирнов',
      email: 'alexey.smirnov@example.com',
      phone: '+7 900 123-45-67',
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
      this.profileData.fullName = ((this.editForm.firstName || '') + ' ' + (this.editForm.lastName || '')).trim();
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
