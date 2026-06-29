/**
 * Student Registration Form with Client-Side Validation
 * Complete Vanilla JavaScript Form Logic with Real-time Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const form = document.getElementById('registrationForm');
  const btnReset = document.getElementById('btnReset');
  const btnSubmit = document.getElementById('btnSubmit');
  const spinner = document.querySelector('.btn-spinner');

  // Fields
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const dobInput = document.getElementById('dob');
  const ageInput = document.getElementById('age');
  const departmentSelect = document.getElementById('department');
  const genderRadios = document.getElementsByName('gender');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('terms');

  // Password Strength & Toggle Elements
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const criteriaLength = document.getElementById('chk-length');
  const criteriaUpper = document.getElementById('chk-upper');
  const criteriaLower = document.getElementById('chk-lower');
  const criteriaNumber = document.getElementById('chk-number');
  const criteriaSpecial = document.getElementById('chk-special');

  // Progress Bar Elements
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');

  // Modals
  const successModal = document.getElementById('successModal');
  const termsModal = document.getElementById('termsModal');
  const termsLink = document.getElementById('termsLink');
  const footTermsLink = document.getElementById('footTermsLink');
  const closeTerms = document.getElementById('closeTerms');
  const agreeTermsBtn = document.getElementById('agreeTermsBtn');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  // Summary Elements inside Success Modal
  const sumName = document.getElementById('sumName');
  const sumEmail = document.getElementById('sumEmail');
  const sumDept = document.getElementById('sumDept');
  const sumDob = document.getElementById('sumDob');
  const sumRefId = document.getElementById('sumRefId');

  // Navigation & Menu Drawer
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // --- Regex Rules ---
  const regexPatterns = {
    // Allows alphabets and spaces, min 3 characters
    fullName: /^[a-zA-Z\s]{3,}$/,
    // Standard secure email validation
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // Exactly 10 digits, numbers only
    phone: /^\d{10}$/
  };

  // State object tracking valid/invalid status of each field for overall progress calculation
  const formState = {
    fullName: false,
    email: false,
    phone: false,
    dob: false,
    age: false,
    department: false,
    gender: false,
    password: false,
    confirmPassword: false,
    terms: false
  };

  // --- Responsive Navigation Logic ---
  // Mobile Menu Slide-Out Toggle
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close Mobile Menu on Link Clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Highlight active nav link
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');

      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Shrink/Fade Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Real-time Scroll Animations ---
  // Simple intersection observer to trigger dynamic scale/fade-ins
  const scrollElements = document.querySelectorAll('.feature-card, .form-card');
  const elementInViewport = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const displayScrollElement = (element) => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInViewport(el, 1.1)) {
        displayScrollElement(el);
      }
    });
  };

  // Initialize scroll states elegantly
  scrollElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });
  
  window.addEventListener('scroll', handleScrollAnimation);
  // Run once on load
  handleScrollAnimation();


  // --- Helper Functions for Validation States ---
  const setFieldValid = (inputElement, stateKey, groupElementId) => {
    const grp = document.getElementById(groupElementId);
    if (grp) {
      grp.classList.remove('error-state');
      grp.classList.add('success-state');
    }
    formState[stateKey] = true;
    updateProgressBar();
  };

  const setFieldInvalid = (inputElement, stateKey, groupElementId) => {
    const grp = document.getElementById(groupElementId);
    if (grp) {
      grp.classList.remove('success-state');
      grp.classList.add('error-state');
    }
    formState[stateKey] = false;
    updateProgressBar();
  };

  const clearFieldState = (groupElementId) => {
    const grp = document.getElementById(groupElementId);
    if (grp) {
      grp.classList.remove('success-state', 'error-state');
    }
  };


  // --- Form Completion Progress Tracker ---
  const updateProgressBar = () => {
    const keys = Object.keys(formState);
    const validCount = keys.filter(key => formState[key] === true).length;
    const progressPercentValue = Math.round((validCount / keys.length) * 100);
    
    progressBar.style.width = `${progressPercentValue}%`;
    progressPercent.textContent = `${progressPercentValue}%`;
  };


  // --- Individual Field Validations ---

  // 1. Full Name Validation
  const validateFullName = () => {
    const value = fullNameInput.value.trim();
    // Rules: Required, min 3 chars, letters and spaces only
    const isValid = regexPatterns.fullName.test(value) && isNaN(value);
    
    if (value === "") {
      setFieldInvalid(fullNameInput, 'fullName', 'grp-fullname');
    } else if (isValid) {
      setFieldValid(fullNameInput, 'fullName', 'grp-fullname');
    } else {
      setFieldInvalid(fullNameInput, 'fullName', 'grp-fullname');
    }
    return isValid;
  };

  // 2. Email Validation
  const validateEmail = () => {
    const value = emailInput.value.trim();
    const isValid = regexPatterns.email.test(value);

    if (value === "") {
      setFieldInvalid(emailInput, 'email', 'grp-email');
    } else if (isValid) {
      setFieldValid(emailInput, 'email', 'grp-email');
    } else {
      setFieldInvalid(emailInput, 'email', 'grp-email');
    }
    return isValid;
  };

  // 3. Phone Number Validation (Keystroke filter + format check)
  phoneInput.addEventListener('keypress', (e) => {
    // Only allow numbers to prevent keyboard mistakes on touch screens
    if (isNaN(String.fromCharCode(e.which))) {
      e.preventDefault();
    }
  });

  const validatePhone = () => {
    const value = phoneInput.value.trim();
    const isValid = regexPatterns.phone.test(value);

    if (value === "") {
      setFieldInvalid(phoneInput, 'phone', 'grp-phone');
    } else if (isValid) {
      setFieldValid(phoneInput, 'phone', 'grp-phone');
    } else {
      setFieldInvalid(phoneInput, 'phone', 'grp-phone');
    }
    return isValid;
  };

  // 4. Date of Birth Validation
  const validateDob = () => {
    const value = dobInput.value;
    const isValid = value !== "";

    if (isValid) {
      setFieldValid(dobInput, 'dob', 'grp-dob');
      
      // Auto Calculate Age if DOB is filled, but don't overwrite if user manually typed age
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      if (calculatedAge >= 10 && calculatedAge <= 100) {
        // Only autofill if Age field is pristine or out of bounds
        const currentAgeVal = parseInt(ageInput.value, 10);
        if (isNaN(currentAgeVal) || currentAgeVal !== calculatedAge) {
          ageInput.value = calculatedAge;
          validateAge(); // Trigger validation for age instantly
        }
      }
    } else {
      setFieldInvalid(dobInput, 'dob', 'grp-dob');
    }
    return isValid;
  };

  // 5. Age Validation
  const validateAge = () => {
    const value = parseInt(ageInput.value, 10);
    // Rules: Required, must be a number between 18 and 60
    const isValid = !isNaN(value) && value >= 18 && value <= 60;

    if (isValid) {
      setFieldValid(ageInput, 'age', 'grp-age');
    } else {
      setFieldInvalid(ageInput, 'age', 'grp-age');
    }
    return isValid;
  };

  // 6. Department Select Validation
  const validateDepartment = () => {
    const value = departmentSelect.value;
    const isValid = value !== "";

    if (isValid) {
      setFieldValid(departmentSelect, 'department', 'grp-department');
    } else {
      setFieldInvalid(departmentSelect, 'department', 'grp-department');
    }
    return isValid;
  };

  // 7. Gender Radios Validation
  const validateGender = () => {
    let checked = false;
    for (let i = 0; i < genderRadios.length; i++) {
      if (genderRadios[i].checked) {
        checked = true;
        break;
      }
    }

    if (checked) {
      setFieldValid(null, 'gender', 'grp-gender');
    } else {
      setFieldInvalid(null, 'gender', 'grp-gender');
    }
    return checked;
  };

  // 8. Password Security & Checklist Validation
  const validatePassword = () => {
    const val = passwordInput.value;
    
    // Check individual criteria
    const hasMinLength = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);

    // Update Checklist badges UI
    updateCriteriaItem(criteriaLength, hasMinLength);
    updateCriteriaItem(criteriaUpper, hasUpper);
    updateCriteriaItem(criteriaLower, hasLower);
    updateCriteriaItem(criteriaNumber, hasNumber);
    updateCriteriaItem(criteriaSpecial, hasSpecial);

    // Calculate Score (0-5)
    let score = 0;
    if (val.length > 0) score += 1; // 1 point for typing anything
    if (hasMinLength) score += 1;
    if (hasUpper && hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    // Update strength meter UI
    strengthBar.className = 'strength-bar';
    strengthText.className = 'strength-status-text';

    if (val === '') {
      strengthBar.style.width = '0%';
      strengthText.textContent = 'Weak';
      strengthText.className = 'strength-status-text weak';
      setFieldInvalid(passwordInput, 'password', 'grp-password');
      return false;
    }

    if (score <= 2) {
      strengthBar.classList.add('weak');
      strengthText.textContent = 'Weak';
      strengthText.classList.add('weak');
    } else if (score <= 4) {
      strengthBar.classList.add('medium');
      strengthText.textContent = 'Medium';
      strengthText.classList.add('medium');
    } else {
      strengthBar.classList.add('strong');
      strengthText.textContent = 'Strong';
      strengthText.classList.add('strong');
    }

    const isAllCriteriaMet = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

    if (isAllCriteriaMet) {
      setFieldValid(passwordInput, 'password', 'grp-password');
    } else {
      setFieldInvalid(passwordInput, 'password', 'grp-password');
    }

    // Re-validate confirm password if it already has values
    if (confirmPasswordInput.value !== '') {
      validateConfirmPassword();
    }

    return isAllCriteriaMet;
  };

  const updateCriteriaItem = (element, isValid) => {
    if (isValid) {
      element.classList.add('valid');
    } else {
      element.classList.remove('valid');
    }
  };

  // 9. Confirm Password Validation
  const validateConfirmPassword = () => {
    const password = passwordInput.value;
    const confirmVal = confirmPasswordInput.value;
    const isValid = confirmVal !== "" && password === confirmVal;

    if (isValid) {
      setFieldValid(confirmPasswordInput, 'confirmPassword', 'grp-confirmPassword');
    } else {
      setFieldInvalid(confirmPasswordInput, 'confirmPassword', 'grp-confirmPassword');
    }
    return isValid;
  };

  // 10. Terms Checkbox Validation
  const validateTerms = () => {
    const isValid = termsCheckbox.checked;

    if (isValid) {
      setFieldValid(termsCheckbox, 'terms', 'grp-terms');
    } else {
      setFieldInvalid(termsCheckbox, 'terms', 'grp-terms');
    }
    return isValid;
  };


  // --- Event Listeners for Live Validation (typing/changing) ---
  fullNameInput.addEventListener('input', validateFullName);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);
  dobInput.addEventListener('change', validateDob);
  ageInput.addEventListener('input', validateAge);
  departmentSelect.addEventListener('change', validateDepartment);
  
  genderRadios.forEach(radio => {
    radio.addEventListener('change', validateGender);
  });
  
  passwordInput.addEventListener('input', validatePassword);
  confirmPasswordInput.addEventListener('input', validateConfirmPassword);
  termsCheckbox.addEventListener('change', validateTerms);


  // --- Show/Hide Passwords Action Logic ---
  const setupPasswordToggle = (btn, input) => {
    btn.addEventListener('click', () => {
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      
      // Toggle hidden class between eye icons
      const eyeIcon = btn.querySelector('.icon-eye');
      const eyeOffIcon = btn.querySelector('.icon-eye-off');
      
      if (eyeIcon && eyeOffIcon) {
        eyeIcon.classList.toggle('hidden');
        eyeOffIcon.classList.toggle('hidden');
      }
    });
  };

  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);


  // --- Modal Utilities ---
  const openModal = (modalElement) => {
    modalElement.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeModal = (modalElement) => {
    modalElement.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll
  };

  // Terms Modal bindings
  termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(termsModal);
  });

  footTermsLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(termsModal);
  });

  closeTerms.addEventListener('click', () => closeModal(termsModal));
  agreeTermsBtn.addEventListener('click', () => {
    termsCheckbox.checked = true;
    validateTerms(); // Validate checkbox instantly
    closeModal(termsModal);
  });

  // Success Modal binds
  closeSuccessBtn.addEventListener('click', () => {
    closeModal(successModal);
    resetForm();
  });

  // Close modals on overlay clicks
  window.addEventListener('click', (e) => {
    if (e.target === termsModal) closeModal(termsModal);
    if (e.target === successModal) closeModal(successModal);
  });


  // --- Form Reset Logic ---
  const resetForm = () => {
    form.reset();

    // Clear all validation styles
    clearFieldState('grp-fullname');
    clearFieldState('grp-email');
    clearFieldState('grp-phone');
    clearFieldState('grp-dob');
    clearFieldState('grp-age');
    clearFieldState('grp-department');
    clearFieldState('grp-gender');
    clearFieldState('grp-password');
    clearFieldState('grp-confirmPassword');
    clearFieldState('grp-terms');

    // Reset local state variables
    Object.keys(formState).forEach(key => {
      formState[key] = false;
    });

    // Reset password checklist UI elements
    updateCriteriaItem(criteriaLength, false);
    updateCriteriaItem(criteriaUpper, false);
    updateCriteriaItem(criteriaLower, false);
    updateCriteriaItem(criteriaNumber, false);
    updateCriteriaItem(criteriaSpecial, false);

    // Reset strength meter UI
    strengthBar.className = 'strength-bar';
    strengthBar.style.width = '0%';
    strengthText.textContent = 'Weak';
    strengthText.className = 'strength-status-text weak';

    // Reset inputs elements type attributes (back to passwords if visible)
    passwordInput.setAttribute('type', 'password');
    confirmPasswordInput.setAttribute('type', 'password');
    document.querySelectorAll('.icon-eye').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.icon-eye-off').forEach(el => el.classList.add('hidden'));

    // Reset Progress Bar
    updateProgressBar();
  };

  btnReset.addEventListener('click', resetForm);


  // --- Form Submit Action Handler ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate every single field comprehensively on submit
    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isDobValid = validateDob();
    const isAgeValid = validateAge();
    const isDeptValid = validateDepartment();
    const isGenderValid = validateGender();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    const isTermsValid = validateTerms();

    const isFormValid = isNameValid && 
                        isEmailValid && 
                        isPhoneValid && 
                        isDobValid && 
                        isAgeValid && 
                        isDeptValid && 
                        isGenderValid && 
                        isPasswordValid && 
                        isConfirmValid && 
                        isTermsValid;

    if (!isFormValid) {
      // Scroll smoothly to the first error-highlighted element in view
      const firstErrorGroup = document.querySelector('.input-group.error-state');
      if (firstErrorGroup) {
        firstErrorGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Visual button loading simulation
    btnSubmit.disabled = true;
    spinner.classList.remove('hidden');

    setTimeout(() => {
      // Fetch values to showcase inside Success Modal summary
      sumName.textContent = fullNameInput.value.trim();
      sumEmail.textContent = emailInput.value.trim();
      
      const deptText = departmentSelect.options[departmentSelect.selectedIndex].text;
      sumDept.textContent = deptText;
      
      sumDob.textContent = dobInput.value;
      
      // Auto-generate a realistic Student matric reference ID
      const randomId = Math.floor(100000 + Math.random() * 900000);
      sumRefId.textContent = `EDU-${randomId}`;

      // Show success popup with clean entrance animation
      openModal(successModal);

      // Re-enable submit button
      btnSubmit.disabled = false;
      spinner.classList.add('hidden');
    }, 1200); // Quick realistic delay
  });
});
