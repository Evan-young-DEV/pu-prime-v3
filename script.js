/* ========================================
   PU Prime - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // Mobile Popup (shows after 1.5s on mobile)
    // ========================================
    const mobilePopup = document.getElementById('mobilePopup');
    const popupClose = document.getElementById('popupClose');

    if (window.innerWidth <= 768) {
        setTimeout(function() {
            if (mobilePopup) {
                mobilePopup.classList.add('active');
            }
        }, 1500);
    }

    if (popupClose) {
        popupClose.addEventListener('click', function() {
            mobilePopup.classList.remove('active');
        });
    }

    if (mobilePopup) {
        mobilePopup.addEventListener('click', function(e) {
            if (e.target === mobilePopup) {
                mobilePopup.classList.remove('active');
            }
        });
    }

    // ========================================
    // Floating Form Toggle
    // ========================================
    const formToggle = document.getElementById('formToggle');
    const formContainer = document.getElementById('formContainer');
    const formClose = document.getElementById('formClose');

    if (formContainer && formToggle) {
        // Form always open on load
        formContainer.classList.add('active');
        formToggle.style.display = 'none';

        formToggle.addEventListener('click', function() {
            formContainer.classList.add('active');
            formToggle.style.display = 'none';
        });
    }

    if (formClose && formContainer && formToggle) {
        formClose.addEventListener('click', function() {
            // Reopen after short delay - always keep visible
            formContainer.classList.remove('active');
            formToggle.style.display = 'flex';
            setTimeout(function() {
                formContainer.classList.add('active');
                formToggle.style.display = 'none';
            }, 3000);
        });
    }

    // ========================================
    // Form Validation & Submission
    // ========================================
    const consultationForm = document.getElementById('consultationForm');
    const agreeAll = document.getElementById('agreeAll');
    const agreementCheckboxes = document.querySelectorAll('.agreement-items input[type="checkbox"]');

    // Agree All functionality
    agreeAll.addEventListener('change', function() {
        agreementCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Update Agree All when individual checkboxes change
    agreementCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(agreementCheckboxes).every(cb => cb.checked);
            agreeAll.checked = allChecked;
        });
    });

    // Form submission
    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate required fields
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const experience = document.getElementById('experience').value;
        const interests = document.querySelectorAll('input[name="interest"]:checked');
        const agree1 = document.querySelector('input[name="agree1"]').checked;
        const agree2 = document.querySelector('input[name="agree2"]').checked;

        if (!name) {
            alert('이름을 입력해주세요.');
            document.getElementById('name').focus();
            return;
        }

        if (!phone) {
            alert('연락처를 입력해주세요.');
            document.getElementById('phone').focus();
            return;
        }

        // Phone number validation
        const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
        if (!phoneRegex.test(phone.replace(/-/g, ''))) {
            alert('올바른 연락처 형식을 입력해주세요.');
            document.getElementById('phone').focus();
            return;
        }

        if (!experience) {
            alert('투자 경험을 선택해주세요.');
            document.getElementById('experience').focus();
            return;
        }

        if (interests.length === 0) {
            alert('관심 상품을 하나 이상 선택해주세요.');
            return;
        }

        if (!agree1 || !agree2) {
            alert('필수 약관에 동의해주세요.');
            return;
        }

        // Collect form data
        const formData = {
            name: name,
            phone: phone,
            experience: experience,
            interests: Array.from(interests).map(i => i.value),
            investment: document.getElementById('investment').value,
            agreeMarketing: agree2,
            agreePromotion: document.querySelector('input[name="agree3"]').checked,
            timestamp: new Date().toISOString()
        };

        console.log('Form Data:', formData);

        // Save to localStorage
        const savedData = JSON.parse(localStorage.getItem('pu_prime_leads') || '[]');
        savedData.push(formData);
        localStorage.setItem('pu_prime_leads', JSON.stringify(savedData));
        console.log('Saved! Total leads:', savedData.length);

        // Show success message
        showSuccessMessage();
    });

    function showSuccessMessage() {
        const formContent = consultationForm.innerHTML;
        consultationForm.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 40px 20px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #00c853 0%, #00d4ff 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <i class="fas fa-check" style="font-size: 36px; color: white;"></i>
                </div>
                <h3 style="font-size: 22px; font-weight: 700; color: #333; margin-bottom: 12px;">상담 신청 완료!</h3>
                <p style="font-size: 14px; color: #666; line-height: 1.6;">
                    신청해 주셔서 감사합니다.<br>
                    전문 상담원이 빠른 시일 내에<br>
                    연락드리겠습니다.
                </p>
                <button type="button" class="btn btn-primary" style="margin-top: 20px; padding: 12px 30px;" onclick="location.reload()">
                    확인
                </button>
            </div>
        `;
    }

    // ========================================
    // Phone Number Auto Format
    // ========================================
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 7) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
        } else if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }

        e.target.value = value;
    });

    // ========================================
    // Header Scroll Effect
    // ========================================
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // ========================================
    // Animated Counter
    // ========================================
    const counters = document.querySelectorAll('.stat-number');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (!target) return;

            const count = parseInt(counter.innerText.replace(/,/g, ''));
            const increment = target / 100;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment).toLocaleString();
                setTimeout(animateCounters, 20);
            } else {
                counter.innerText = target.toLocaleString();
            }
        });
    };

    // Intersection Observer for counter animation
    const statsSection = document.querySelector('.stats');
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ========================================
    // Card Hover Effects
    // ========================================
    const cards = document.querySelectorAll('.product-card, .why-card, .account-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('account-card') && this.classList.contains('featured')
                ? 'scale(1.05) translateY(-10px)'
                : 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('account-card') && this.classList.contains('featured')
                ? 'scale(1.05)'
                : 'translateY(0)';
        });
    });

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // ========================================
    // Trading Card Animation
    // ========================================
    const tradingCards = document.querySelectorAll('.trading-card');

    tradingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.animation = 'fadeInRight 0.6s ease forwards';
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .main-nav.active {
            display: block;
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 15, 0.98);
            padding: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .main-nav.active .nav-menu {
            flex-direction: column;
        }

        .main-nav.active .dropdown-menu {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            background: transparent;
            border: none;
            padding-left: 20px;
            box-shadow: none;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // Live Price Simulation
    // ========================================
    function simulatePriceUpdate() {
        const priceElements = document.querySelectorAll('.card-price');

        priceElements.forEach(el => {
            const currentPrice = parseFloat(el.textContent.replace(/,/g, ''));
            const change = (Math.random() - 0.5) * 0.01 * currentPrice;
            const newPrice = currentPrice + change;

            if (currentPrice > 1000) {
                el.textContent = newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else if (currentPrice > 1) {
                el.textContent = newPrice.toFixed(4);
            } else {
                el.textContent = newPrice.toFixed(5);
            }
        });
    }

    // Update prices every 3 seconds
    setInterval(simulatePriceUpdate, 3000);

    // ========================================
    // Intersection Observer for Fade-in Animation
    // ========================================
    const fadeElements = document.querySelectorAll('.product-card, .why-card, .account-card, .section-header');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    // ========================================

    console.log('PU Prime website initialized successfully!');
});
