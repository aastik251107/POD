import './style.css';

// --- Types ---
type Screen = 'onboarding' | 'dashboard' | 'courses' | 'leaderboard' | 'achievements' | 'ai-coach' | 'schedule' | 'course-detail' | 'groups';

interface AppState {
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  user: {
    name: string;
    xp: number;
    streak: number;
    rank: number;
    avatar: string;
    level: number;
  };
  courses: Array<{
    id: string;
    title: string;
    instructor: string;
    progress: number;
    totalLectures: number;
    completedLectures: number;
    streak: number;
    color: string;
    icon: string;
    category: string;
  }>;
  selectedCourseId: string | null;
  groups: Array<{
    id: string;
    name: string;
    members: number;
    activity: string;
    rank: string;
    icon: string;
    color: string;
  }>;
}

// --- Store ---
class Store {
  private static KEY = 'progresspact_v3_state';

  static get(): AppState {
    const data = localStorage.getItem(this.KEY);
    if (data) return JSON.parse(data);
    return this.getDefault();
  }

  static save(state: AppState) {
    localStorage.setItem(this.KEY, JSON.stringify(state));
  }

  private static getDefault(): AppState {
    return {
      hasCompletedOnboarding: false,
      onboardingStep: 1,
      user: {
        name: 'Aastik',
        xp: 3160,
        streak: 14,
        rank: 5,
        avatar: 'A',
        level: 12
      },
      selectedCourseId: '1',
      courses: [
        {
          id: '1',
          title: 'React & Next.js Bootcamp 2024',
          instructor: 'Brad Traversy',
          progress: 68,
          totalLectures: 142,
          completedLectures: 96,
          streak: 12,
          color: '#0D9488',
          icon: '⚛️',
          category: 'Web Development'
        },
        {
          id: '2',
          title: 'Machine Learning A–Z: AI Mastery',
          instructor: 'Kirill Eremenko',
          progress: 31,
          totalLectures: 180,
          completedLectures: 56,
          streak: 5,
          color: '#6366F1',
          icon: '🤖',
          category: 'Data Science'
        },
        {
          id: '3',
          title: 'Advanced Figma Design Systems',
          instructor: 'Zander Whitehurst',
          progress: 85,
          totalLectures: 64,
          completedLectures: 54,
          streak: 8,
          color: '#F43F5E',
          icon: '🎨',
          category: 'UI/UX Design'
        }
      ],
      groups: [
        { id: 'g1', name: 'React Wizards', members: 42, activity: '3 mins ago', rank: 'Top 1%', icon: '⚛️', color: '#0D9488' },
        { id: 'g2', name: 'UI/UX Collective', members: 128, activity: '12 mins ago', rank: 'Top 5%', icon: '🎨', color: '#F43F5E' }
      ]
    };
  }
}

// --- App ---
class App {
  private state: AppState;
  private currentScreen: Screen;
  private container: HTMLElement;

  constructor() {
    this.state = Store.get();
    this.currentScreen = this.state.hasCompletedOnboarding ? 'dashboard' : 'onboarding';
    this.container = document.getElementById('app')!;
    this.init();
  }

  private init() {
    this.render();
  }

  public handleCourseClick(id: string) {
    this.state.selectedCourseId = id;
    Store.save(this.state);
    this.navigate('course-detail');
  }

  public navigate(screen: Screen) {
    this.currentScreen = screen;
    this.render();
  }

  private render() {
    this.container.innerHTML = '';
    
    if (this.currentScreen === 'onboarding') {
      this.renderOnboarding(this.container);
      return;
    }

    // Sidebar (Hierarchy & Consistency)
    const sidebar = document.createElement('nav');
    sidebar.className = 'sidebar';
    sidebar.setAttribute('aria-label', 'Main Navigation');
    this.renderSidebar(sidebar);
    this.container.appendChild(sidebar);

    // Main Content Area (Alignment & Proximity)
    const main = document.createElement('main');
    main.className = 'main-content animate-in';
    main.setAttribute('role', 'main');
    
    switch (this.currentScreen) {
      case 'dashboard': this.renderDashboard(main); break;
      case 'courses': this.renderCourses(main); break;
      case 'leaderboard': this.renderLeaderboard(main); break;
      case 'achievements': this.renderAchievements(main); break;
      case 'groups': this.renderGroups(main); break;
      case 'ai-coach': this.renderAICoach(main); break;
      case 'schedule': this.renderSchedule(main); break;
      case 'course-detail': this.renderCourseDetail(main); break;
    }

    this.container.appendChild(main);
  }

  // Principle 2: Progressive Disclosure (Multi-step Onboarding)
  private renderOnboarding(el: HTMLElement) {
    const step = this.state.onboardingStep;
    const totalSteps = 3;

    el.innerHTML = `
      <div style="width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; background: white">
        <div style="max-width: 480px; width: 100%; padding: 48px; text-align: center">
          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 48px">
            ${Array.from({length: totalSteps}).map((_, i) => `
              <div style="width: 40px; height: 6px; border-radius: 3px; background: ${i < step ? 'var(--primary)' : 'var(--border)'}; transition: all 0.3s"></div>
            `).join('')}
          </div>

          ${step === 1 ? `
            <div style="font-size: 64px; margin-bottom: 24px">👋</div>
            <h1 class="animate-in" style="font-size: 40px; margin-bottom: 16px; letter-spacing: -0.04em">Welcome to ProgressPact</h1>
            <p class="animate-in" style="color: var(--text-muted); margin-bottom: 48px; font-size: 18px">Your journey to mastery starts here. Let's personalize your path. What should we call you?</p>
            <input type="text" id="ob-name-input" placeholder="Your first name" class="card" style="width: 100%; padding: 24px; border-radius: 24px; margin-bottom: 40px; font-size: 24px; text-align: center; border-width: 2px; font-weight: 700; border-color: var(--primary)" value="${this.state.user.name}">
          ` : step === 2 ? `
            <div style="font-size: 64px; margin-bottom: 24px">🎯</div>
            <h1 class="animate-in" style="font-size: 40px; margin-bottom: 16px; letter-spacing: -0.04em">Pick your Domain</h1>
            <p class="animate-in" style="color: var(--text-muted); margin-bottom: 48px; font-size: 18px">We'll tailor your dashboard to your interests.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px">
              ${['Web Dev', 'AI/ML', 'Design', 'Marketing'].map(cat => `
                <div class="card ob-category" data-cat="${cat}" style="padding: 24px; cursor: pointer; border-width: 2px; border-color: ${cat === 'Web Dev' ? 'var(--primary)' : 'var(--border)'}; background: ${cat === 'Web Dev' ? 'var(--primary-light)' : 'white'}">
                  <div style="font-weight: 800; font-size: 16px">${cat}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <h1 class="animate-in" style="margin-bottom: 16px">Set your Daily Goal</h1>
            <p class="animate-in" style="color: var(--text-muted); margin-bottom: 40px">How many lectures do you want to finish every day?</p>
            <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 48px">
              ${[1, 2, 3, 4, 5].map(g => `
                <div class="ob-goal" data-goal="${g}" style="width: 72px; height: 72px; border-radius: 50%; border: 3px solid ${g === 2 ? 'var(--primary)' : 'var(--border)'}; background: ${g === 2 ? 'var(--primary-light)' : 'transparent'}; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; cursor: pointer; transition: all 0.2s">${g}</div>
              `).join('')}
            </div>
          `}

          <button class="btn" id="ob-next" style="width: 100%; padding: 20px; font-size: 18px">${step === 3 ? 'Get Started' : 'Continue'}</button>
        </div>
      </div>
    `;

    // Step 1: Name Input Logic
    if (step === 1) {
      const nameInput = el.querySelector('#ob-name-input') as HTMLInputElement;
      nameInput.addEventListener('input', () => {
        this.state.user.name = nameInput.value || 'Learner';
      });
      nameInput.focus();
    }

    // Step 2: Category Selection Logic
    if (step === 2) {
      el.querySelectorAll('.ob-category').forEach(card => {
        card.addEventListener('click', () => {
          el.querySelectorAll('.ob-category').forEach(c => {
            (c as HTMLElement).style.borderColor = 'var(--border)';
            (c as HTMLElement).style.background = 'white';
          });
          (card as HTMLElement).style.borderColor = 'var(--primary)';
          (card as HTMLElement).style.background = 'var(--primary-light)';
        });
      });
    }

    // Step 3: Goal Selection Logic
    if (step === 3) {
      el.querySelectorAll('.ob-goal').forEach(goal => {
        goal.addEventListener('click', () => {
          el.querySelectorAll('.ob-goal').forEach(g => {
            (g as HTMLElement).style.borderColor = 'var(--border)';
            (g as HTMLElement).style.background = 'transparent';
          });
          (goal as HTMLElement).style.borderColor = 'var(--primary)';
          (goal as HTMLElement).style.background = 'var(--primary-light)';
        });
      });
    }

    el.querySelector('#ob-next')?.addEventListener('click', () => {
      if (this.state.onboardingStep < totalSteps) {
        this.state.onboardingStep++;
        Store.save(this.state);
        this.render();
      } else {
        this.state.hasCompletedOnboarding = true;
        Store.save(this.state);
        this.navigate('dashboard');
      }
    });
  }

  private renderSidebar(el: HTMLElement) {
    el.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 48px">
        <div style="width: 44px; height: 44px; background: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 22px">PP</div>
        <div class="logo-text" style="font-weight: 900; font-size: 22px; letter-spacing: -0.05em">ProgressPact</div>
      </div>

      <div class="nav-group">
        ${[
          { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
          { id: 'courses', icon: '📚', label: 'My Courses' },
          { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
          { id: 'achievements', icon: '🎖️', label: 'Achievements' },
          { id: 'groups', icon: '👥', label: 'Peer Groups' },
          { id: 'ai-coach', icon: '🤖', label: 'AI Coach' }
        ].map(item => `
          <button class="nav-link ${this.currentScreen === item.id ? 'active' : ''}" id="nav-${item.id}" aria-current="${this.currentScreen === item.id ? 'page' : 'false'}" style="border: none; background: transparent; width: 100%; text-align: left; cursor: pointer">
            <span style="font-size: 22px">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
          </button>
        `).join('')}
      </div>

      <div style="margin-top: auto; padding-top: 32px; border-top: 1px solid var(--border)">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px">
          <div style="width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 18px">${this.state.user.avatar}</div>
          <div class="logo-text">
            <div style="font-weight: 800; font-size: 15px">${this.state.user.name}</div>
            <div style="font-size: 12px; color: var(--text-light); font-weight: 600">Level ${this.state.user.level} · PRO</div>
          </div>
        </div>
        <button class="btn btn-secondary" id="logout-btn" style="width: 100%; padding: 12px; font-size: 13px; color: #F43F5E !important; border-color: #FECACA !important">🚪 Logout</button>
      </div>
    `;

    ['dashboard', 'courses', 'leaderboard', 'achievements', 'groups', 'ai-coach'].forEach(id => {
      el.querySelector(`#nav-${id}`)?.addEventListener('click', () => this.navigate(id as Screen));
    });

    el.querySelector('#logout-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout? Your progress will be reset.')) {
        localStorage.removeItem('progresspact_v3_state');
        location.reload(); // Hard reset to onboarding
      }
    });
  }

  // Principle 1 & 6: Hierarchy & Proximity
  private renderDashboard(el: HTMLElement) {
    el.innerHTML = `
      <header style="margin-bottom: 64px">
        <!-- Anchor Object: Large, bold greeting -->
        <h1 style="font-size: 48px; letter-spacing: -0.04em; margin-bottom: 12px">Hey ${this.state.user.name}, ready to <span style="color: var(--primary)">level up?</span></h1>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <p style="color: var(--text-muted); font-size: 20px; font-weight: 500">You're just 2 lectures away from your weekly goal.</p>
          <div style="display: flex; gap: 20px">
             <!-- Fitts's Law: Prominent, high-contrast buttons -->
             <button class="btn btn-secondary" id="dash-schedule">📅 My Schedule</button>
             <button class="btn" id="dash-resume">🚀 Resume Learning</button>
          </div>
        </div>
      </header>

      <!-- Modularity: Distinct blocks for different types of info -->
      <section style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-bottom: 64px" aria-label="Quick Stats">
        <div class="card stat-card" style="border-bottom: 4px solid #F59E0B">
          <div class="stat-value" style="color: #D97706">${this.state.user.xp.toLocaleString()}</div>
          <div class="stat-label">Experience Points</div>
        </div>
        <div class="card stat-card" style="border-bottom: 4px solid var(--accent)">
          <div class="stat-value" style="color: var(--accent)">🔥 ${this.state.user.streak}</div>
          <div class="stat-label">Day Streak</div>
        </div>
        <div class="card stat-card" style="border-bottom: 4px solid var(--secondary)">
          <div class="stat-value" style="color: var(--secondary)">#${this.state.user.rank}</div>
          <div class="stat-label">Global Rank</div>
        </div>
        <div class="card stat-card" style="border-bottom: 4px solid #059669">
          <div class="stat-value" style="color: #059669">84%</div>
          <div class="stat-label">Average Accuracy</div>
        </div>
      </section>

      <div style="display: grid; grid-template-columns: 1.8fr 1.2fr; gap: 48px">
        <section>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px">
            <h2>Current Courses</h2>
            <button style="color: var(--primary); font-weight: 800; background: transparent; border: none; cursor: pointer; font-size: 15px" id="view-courses">Browse Library →</button>
          </div>
          <div class="grid" style="grid-template-columns: 1fr 1fr">
            ${this.state.courses.slice(0, 2).map(course => `
              <div class="card" style="padding: 0; overflow: hidden; cursor: pointer" onclick="window.app.navigate('course-detail')">
                <div style="height: 140px; background: ${course.color}15; display: flex; align-items: center; justify-content: center; font-size: 56px">
                  ${course.icon}
                </div>
                <div style="padding: 24px">
                  <div style="font-size: 11px; font-weight: 900; color: ${course.color}; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em">${course.category}</div>
                  <h3 style="margin-bottom: 4px; font-size: 18px">${course.title}</h3>
                  <p style="font-size: 13px; color: var(--text-light); margin-bottom: 24px; font-weight: 600">${course.instructor}</p>
                  
                  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 10px; font-weight: 800">
                    <span style="color: var(--text-muted)">${course.progress}% Complete</span>
                    <span style="color: var(--accent)">🔥 ${course.streak}d Streak</span>
                  </div>
                  <div style="height: 10px; background: #F1F5F9; border-radius: 5px; overflow: hidden">
                    <div style="height: 100%; width: ${course.progress}%; background: ${course.color}; transition: width 1s ease-out"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
        
        <aside>
          <h2 style="margin-bottom: 32px">AI Insights</h2>
          <div class="card" style="background: white; border-radius: 24px; padding: 32px; border-left: 8px solid var(--secondary)">
            <div style="display: flex; gap: 20px; align-items: flex-start">
              <div style="background: #EEF2FF; padding: 14px; border-radius: 18px; font-size: 28px">🤖</div>
              <div>
                <h3 style="margin-bottom: 8px">Daily Roadmap</h3>
                <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px">
                  Arjun is just **160 XP** ahead. Completing "Hooks: useEffect" today will push you into the top 4 learners. 
                </p>
                <button class="btn" id="ai-lets-study" style="width: 100%; font-size: 15px">Let's Study</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    `;

    el.querySelector('#view-courses')?.addEventListener('click', () => this.navigate('courses'));
    el.querySelector('#dash-schedule')?.addEventListener('click', () => this.navigate('schedule'));
    el.querySelector('#dash-resume')?.addEventListener('click', () => this.navigate('course-detail'));
    el.querySelector('#ai-lets-study')?.addEventListener('click', () => this.navigate('course-detail'));
  }

  // Principle 3 & 7: Consistency & Alignment
  private renderCourses(el: HTMLElement) {
    el.innerHTML = `
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 56px">
        <h1>My Learning Path</h1>
        <button class="btn" id="explore-more-btn">+ Explore More</button>
      </header>
      
      <div class="grid">
        ${this.state.courses.map(course => `
          <div class="card" style="padding: 0; overflow: hidden; cursor: pointer; position: relative" onclick="window.app.handleCourseClick('${course.id}')">
            <!-- Delete Button (Contrast & Emphasis) -->
            <button class="btn-delete" data-id="${course.id}" style="position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 1px solid #FECACA; color: #F43F5E; display: flex; align-items: center; justify-content: center; font-size: 18px; z-index: 10; cursor: pointer; transition: all 0.2s" title="Delete Course">×</button>
            
            <div style="height: 180px; background: ${course.color}15; display: flex; align-items: center; justify-content: center; font-size: 72px">
              ${course.icon}
            </div>
            <div style="padding: 32px">
              <div style="font-size: 12px; font-weight: 900; color: ${course.color}; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.1em">${course.category}</div>
              <h2 style="font-size: 22px; margin-bottom: 8px">${course.title}</h2>
              <p style="color: var(--text-light); font-size: 14px; margin-bottom: 32px; font-weight: 600">${course.instructor} · ${course.totalLectures} lectures</p>
              
              <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 12px; font-weight: 800">
                <span style="color: var(--text-muted)">${course.progress}% Complete</span>
                <span style="color: var(--accent)">🔥 ${course.streak}d Streak</span>
              </div>
              <div style="height: 12px; background: #F1F5F9; border-radius: 6px; overflow: hidden">
                <div style="height: 100%; width: ${course.progress}%; background: ${course.color}; transition: width 1s ease-out"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    el.querySelector('#explore-more-btn')?.addEventListener('click', () => {
      const url = prompt("Enter a course URL (Udemy, Coursera, or YouTube) to import:");
      if (!url) return;

      let title = "Imported Course";
      let instructor = "Online Instructor";
      let color = "#8B5CF6";
      let icon = "🌐";
      let category = "Self-Study";

      if (url.includes('udemy')) {
        title = "Udemy Mastery Class";
        instructor = "Top Rated Instructor";
        color = "#A435F0";
        icon = "🎓";
        category = "Premium Course";
      } else if (url.includes('coursera')) {
        title = "Coursera Specialization";
        instructor = "University Professor";
        color = "#0056D2";
        icon = "🏛️";
        category = "Academic";
      } else if (url.includes('youtube')) {
        title = "YouTube Learning Series";
        instructor = "Content Creator";
        color = "#FF0000";
        icon = "📺";
        category = "Public Domain";
      }

      const newCourse = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        instructor,
        progress: 0,
        totalLectures: 24,
        completedLectures: 0,
        streak: 0,
        color,
        icon,
        category
      };

      this.state.courses.push(newCourse);
      Store.save(this.state);
      this.render();
      alert(`Successfully imported "${title}" from ${new URL(url).hostname}!`);
    });

    el.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (btn as HTMLElement).dataset.id;
        if (confirm('Are you sure you want to remove this course?')) {
          this.state.courses = this.state.courses.filter(c => c.id !== id);
          Store.save(this.state);
          this.render();
        }
      });
    });
  }

  private renderLeaderboard(el: HTMLElement) {
    el.innerHTML = `
      <h1 style="margin-bottom: 56px">Global Hall of Fame</h1>
      
      <div style="display: flex; align-items: flex-end; justify-content: center; gap: 48px; margin-bottom: 80px; padding-top: 40px">
        <div style="text-align: center; width: 220px">
          <div style="font-size: 48px; margin-bottom: 16px">🥈</div>
          <div style="width: 110px; height: 110px; border-radius: 28px; background: #E2E8F0; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 900; color: #475569">K</div>
          <h3 style="font-size: 20px">Krishna</h3>
          <p style="color: var(--text-light); font-size: 15px; margin-bottom: 16px; font-weight: 700">4,210 XP</p>
          <div style="height: 140px; background: #E2E8F0; border-radius: 20px 20px 0 0"></div>
        </div>
        <div style="text-align: center; width: 260px">
          <div style="font-size: 64px; margin-bottom: 16px">🥇</div>
          <div style="width: 140px; height: 140px; border-radius: 36px; border: 6px solid #F59E0B; background: #FEF3C7; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 56px; font-weight: 900; color: #D97706">A</div>
          <h2 style="color: #D97706; font-size: 28px">Arjun</h2>
          <p style="color: #D97706; font-size: 18px; font-weight: 900; margin-bottom: 16px">4,820 XP</p>
          <div style="height: 220px; background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 24px 24px 0 0"></div>
        </div>
        <div style="text-align: center; width: 220px">
          <div style="font-size: 48px; margin-bottom: 16px">🥉</div>
          <div style="width: 110px; height: 110px; border-radius: 28px; background: #FFEDD5; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 900; color: #EA580C">P</div>
          <h3 style="font-size: 20px">Parv</h3>
          <p style="color: var(--accent); font-size: 15px; margin-bottom: 16px; font-weight: 700">3,780 XP</p>
          <div style="height: 100px; background: #FFEDD5; border-radius: 20px 20px 0 0"></div>
        </div>
      </div>

      <div class="card" style="padding: 0; overflow: hidden; border-radius: 24px">
        <table style="width: 100%; border-collapse: collapse">
          <thead>
            <tr style="background: #F8FAFC; text-align: left; border-bottom: 1px solid var(--border)">
              <th style="padding: 24px 40px; font-size: 12px; font-weight: 900; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em">Rank</th>
              <th style="padding: 24px 40px; font-size: 12px; font-weight: 900; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em">Learner</th>
              <th style="padding: 24px 40px; font-size: 12px; font-weight: 900; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em">Status</th>
              <th style="padding: 24px 40px; font-size: 12px; font-weight: 900; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em">Experience</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: var(--primary-light); border-bottom: 1px solid var(--border)">
              <td style="padding: 24px 40px; font-weight: 900; color: var(--primary)">5</td>
              <td style="padding: 24px 40px; display: flex; align-items: center; gap: 20px">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px">A</div>
                <div style="font-weight: 800; color: var(--primary); font-size: 16px">YOU (Aastik)</div>
              </td>
              <td style="padding: 24px 40px; color: var(--accent); font-weight: 800">🔥 14-day streak</td>
              <td style="padding: 24px 40px; font-weight: 900; color: #D97706">3,160 XP</td>
            </tr>
            ${Array.from({length: 3}).map((_, i) => `
              <tr style="border-bottom: 1px solid var(--border)">
                <td style="padding: 24px 40px; color: var(--text-muted); font-weight: 600">${6 + i}</td>
                <td style="padding: 24px 40px; display: flex; align-items: center; gap: 20px">
                  <div style="width: 44px; height: 44px; border-radius: 12px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--text-light)">S</div>
                  <div style="font-weight: 800; color: var(--text-main); font-size: 16px">Learner ${6+i}</div>
                </td>
                <td style="padding: 24px 40px; color: var(--text-light); font-weight: 600">Active 2h ago</td>
                <td style="padding: 24px 40px; font-weight: 800; color: var(--text-main)">${2800 - i*200} XP</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderAchievements(el: HTMLElement) {
    el.innerHTML = `
      <h1 style="margin-bottom: 56px">Milestones & Rewards</h1>
      
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 48px">
        <div>
           <div class="card" style="background: linear-gradient(135deg, #FFF7ED, #FFEDD5); border-color: #FED7AA; text-align: center; padding: 48px 32px">
            <div style="font-size: 80px; margin-bottom: 24px">🔥</div>
            <div style="font-size: 56px; font-weight: 900; color: var(--accent); letter-spacing: -0.02em">14 Days</div>
            <div style="font-size: 16px; color: var(--accent); font-weight: 800; margin-bottom: 32px; text-transform: uppercase">Current Streak</div>
            
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-bottom: 32px">
              ${Array.from({length: 28}).map((_, i) => `<div style="height: 20px; background: ${i < 14 ? 'var(--accent)' : '#FED7AA66'}; border-radius: 6px"></div>`).join('')}
            </div>
            <p style="font-size: 15px; color: #9A3412; font-weight: 600; line-height: 1.6">Your personal best is **21 days**. Only 7 more days to break your record!</p>
          </div>
        </div>
        
        <div>
          <h2 style="margin-bottom: 32px">Badge Collection</h2>
          <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 24px">
            ${[
              { icon: '🚀', name: 'Early Adopter', desc: 'Joined in beta phase' },
              { icon: '⚡', name: 'Speed Demon', desc: '5 lectures in one day' },
              { icon: '🎯', name: 'Goal Getter', desc: 'Hit weekly target consistently' },
              { icon: '🤝', name: 'Peer Mentor', desc: 'Helped 5 students in groups' },
              { icon: '📚', name: 'Bookworm', desc: 'Finished your first course' },
              { icon: '💎', name: 'Top 10%', desc: 'Elite performer this month' }
            ].map(b => `
              <div class="card" style="text-align: center; padding: 32px 20px">
                <div style="font-size: 48px; margin-bottom: 16px">${b.icon}</div>
                <div style="font-weight: 900; font-size: 16px; margin-bottom: 8px">${b.name}</div>
                <div style="font-size: 11px; color: var(--text-light); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em">${b.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private handleAIResponse(val: string, messagesContainer: HTMLElement) {
    const typing = document.createElement('div');
    typing.className = 'glass-card animate-in';
    typing.style.alignSelf = 'flex-start';
    typing.style.padding = '16px 24px';
    typing.innerHTML = `<div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>`;
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
      typing.remove();
      const aiMsg = document.createElement('div');
      aiMsg.className = 'card animate-in';
      aiMsg.style.alignSelf = 'flex-start';
      aiMsg.style.maxWidth = '75%';
      aiMsg.style.padding = '32px';
      aiMsg.style.borderRadius = '0 32px 32px 32px';
      aiMsg.style.borderLeft = '8px solid var(--primary)';

      const input = val.toLowerCase();
      let reply = "";

      if (input.includes('react') || input.includes('hook') || input.includes('state')) {
        reply = `Excellent technical query! Since you're **68% through the React Bootcamp**, you're entering the 'Hooks Deep Dive'. Try implementing a **useMemo** hook to optimize your expensive calculations today. It's a game-changer! ⚛️`;
      } else if (input.includes('streak') || input.includes('consistency')) {
        reply = `You're on a **14-day streak**, Aastik! Consistency is your superpower. Did you know that learners with 14+ day streaks are 3x more likely to finish their courses? Keep the momentum! 🔥`;
      } else if (input.includes('rank') || input.includes('arjun')) {
        reply = `Arjun is leading at #1. To take his spot, you need exactly **1,660 XP**. Completing the next 2 modules in React and finishing the weekly challenge will get you there! 🏆`;
      } else {
        reply = `I'm here to help you master your path! Based on your schedule, you've got a learning session coming up in 2 hours. Shall we prep some review materials? 📚`;
      }

      aiMsg.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px">
          <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 20px">🤖</div>
          <div style="font-weight: 900; font-size: 16px; color: var(--primary); letter-spacing: -0.02em">NATIVE AI COACH</div>
        </div>
        <p style="font-size: 16px; line-height: 1.7; font-weight: 500">${reply}</p>
      `;
      
      messagesContainer.appendChild(aiMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1200);
  }

  private renderGroups(el: HTMLElement) {
    el.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; padding-bottom: 80px">
        <header style="margin-bottom: 40px">
          <h1 style="font-size: 34px; font-weight: 800; letter-spacing: -0.04em">Study Groups</h1>
        </header>

        <section style="margin-bottom: 48px">
          <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 24px">My Groups</h2>
          <div style="background: #E6FFFA; border-radius: 20px; padding: 20px; display: flex; align-items: center; gap: 16px; margin-bottom: 32px">
            <div style="font-size: 32px; background: white; width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05)">⚛️</div>
            <div style="flex: 1">
              <div style="font-weight: 800; font-size: 17px; color: #1A202C">React Dev Cohort #12</div>
              <div style="font-size: 13px; color: #718096; font-weight: 600">8 members · 3 online now</div>
            </div>
            <span style="background: #0D9488; color: white; padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 800">Joined</span>
          </div>

          <div class="card" style="padding: 0; overflow: hidden; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.05)">
            <div style="padding: 16px 20px; border-bottom: 1px solid #EDF2F7; display: flex; align-items: center; gap: 10px">
              <span style="font-size: 18px">💬</span>
              <span style="font-weight: 800; font-size: 15px; color: #2D3748">Group Chat</span>
            </div>
            
            <div id="group-chat-window" style="height: 320px; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px">
              <div style="align-self: flex-start; max-width: 85%">
                <div style="font-size: 11px; color: #A0AEC0; font-weight: 700; margin-left: 4px; margin-bottom: 4px">Arjun</div>
                <div style="background: #F7FAFC; border: 1.5px solid #EDF2F7; padding: 12px 18px; border-radius: 18px; border-bottom-left-radius: 4px; font-size: 15px; font-weight: 600; color: #2D3748">bro did you finish hooks section?</div>
              </div>
              
              <div style="align-self: flex-end; max-width: 85%">
                <div style="background: #0D9488; color: white; padding: 12px 18px; border-radius: 18px; border-bottom-right-radius: 4px; font-size: 15px; font-weight: 600">yeah! useEffect cleanup is key 🔥</div>
              </div>

              <div style="align-self: flex-start; max-width: 85%">
                <div style="font-size: 11px; color: #A0AEC0; font-weight: 700; margin-left: 4px; margin-bottom: 4px">Parv</div>
                <div style="background: #F7FAFC; border: 1.5px solid #EDF2F7; padding: 12px 18px; border-radius: 18px; border-bottom-left-radius: 4px; font-size: 15px; font-weight: 600; color: #2D3748">I'm on lesson 40 now</div>
              </div>

              <div style="align-self: flex-end; max-width: 85%">
                <div style="background: #0D9488; color: white; padding: 12px 18px; border-radius: 18px; border-bottom-right-radius: 4px; font-size: 15px; font-weight: 600">let's do a sync call sunday?</div>
              </div>
            </div>

            <div style="padding: 20px; border-top: 1px solid #EDF2F7; display: flex; gap: 12px">
              <input type="text" id="chat-input" placeholder="Type a message..." style="flex: 1; padding: 14px 20px; border-radius: 14px; border: 1.5px solid #E2E8F0; font-family: inherit; font-size: 15px; outline: none">
              <button id="send-chat-btn" style="background: #0D9488; color: white; border: none; width: 48px; height: 48px; border-radius: 14px; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center">↑</button>
            </div>
          </div>
        </section>

        <section>
          <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 24px">Discover Groups</h2>
          <div style="display: flex; flex-direction: column; gap: 20px">
            ${[
              { name: 'ML Beginners July', members: 12, online: 5, icon: '🤖', color: '#6366F1' },
              { name: 'UX Practitioners', members: 6, online: 2, icon: '🎨', color: '#F43F5E' }
            ].map(group => `
              <div style="display: flex; align-items: center; gap: 20px; padding: 16px 0; border-bottom: 1px solid #EDF2F7">
                <div style="font-size: 32px">${group.icon}</div>
                <div style="flex: 1">
                  <div style="font-weight: 800; font-size: 16px; color: #2D3748">${group.name}</div>
                  <div style="font-size: 13px; color: #718096; font-weight: 600">${group.members} members · ${group.online} online</div>
                </div>
                <button class="btn btn-secondary join-group-btn" data-name="${group.name}" data-icon="${group.icon}" data-color="${group.color}" style="border-radius: 12px; padding: 10px 24px; border-width: 2px">Join</button>
              </div>
            `).join('')}
          </div>
        </section>

        <button class="btn btn-secondary" id="create-group-btn" style="width: 100%; margin-top: 48px; padding: 20px; border-radius: 18px; font-size: 17px; border-width: 2px">+ Create New Group</button>
      </div>
    `;

    // Re-attach listeners
    const chatWindow = el.querySelector('#group-chat-window') as HTMLElement;
    const chatInput = el.querySelector('#chat-input') as HTMLInputElement;
    const sendBtn = el.querySelector('#send-chat-btn');

    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;
      const bubble = document.createElement('div');
      bubble.style.alignSelf = 'flex-end';
      bubble.style.maxWidth = '85%';
      bubble.innerHTML = `<div style="background: #0D9488; color: white; padding: 12px 18px; border-radius: 18px; border-bottom-right-radius: 4px; font-size: 15px; font-weight: 600">${text}</div>`;
      chatWindow.appendChild(bubble);
      chatInput.value = '';
      chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    sendBtn?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    el.querySelectorAll('.join-group-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const { name, icon, color } = (btn as HTMLElement).dataset;
        if (this.state.groups.some(g => g.name === name)) {
          alert("You're already in this group!");
          return;
        }
        this.state.groups.push({
          id: Math.random().toString(36).substr(2, 9),
          name: name!,
          icon: icon!,
          color: color!,
          members: Math.floor(Math.random() * 20) + 5,
          activity: 'Just now',
          rank: 'Member'
        });
        Store.save(this.state);
        this.render();
        alert(`Successfully joined ${name}! 🚀`);
      });
    });

    el.querySelector('#create-group-btn')?.addEventListener('click', () => {
      const name = prompt("Enter a name for your new study group:");
      if (!name) return;
      this.state.groups.push({
        id: Math.random().toString(36).substr(2, 9),
        name,
        icon: '🚀',
        color: '#10B981',
        members: 1,
        activity: 'Just now',
        rank: 'Founder'
      });
      Store.save(this.state);
      this.render();
      alert(`Group "${name}" created successfully!`);
    });
  }

  private renderAICoach(el: HTMLElement) {
    el.innerHTML = `
      <div style="display: flex; flex-direction: column; height: calc(100vh - 96px)">
        <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 48px">
           <div>
            <h1>Learning Assistant</h1>
            <p style="color: var(--text-muted); font-size: 18px; font-weight: 500">Real-time coaching tailored to your progress.</p>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; background: white; padding: 14px 28px; border-radius: 20px; border: 1px solid var(--border)">
            <div style="width: 10px; height: 10px; background: #059669; border-radius: 50%"></div>
            <span style="font-weight: 800; color: #059669; font-size: 14px">COACH ONLINE</span>
          </div>
        </header>

        <div class="card" style="flex: 1; display: flex; flex-direction: column; padding: 0; overflow: hidden; border-radius: 32px">
          <div id="chat-messages" style="flex: 1; padding: 48px; overflow-y: auto; background: #F8FAFC; display: flex; flex-direction: column; gap: 32px">
            <div class="card animate-in" style="align-self: flex-start; max-width: 70%; padding: 32px; border-radius: 0 32px 32px 32px; border-left: 8px solid var(--primary)">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px">
                 <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 20px">🤖</div>
                 <div style="font-weight: 900; font-size: 16px; color: var(--primary)">NATIVE AI COACH</div>
              </div>
              <p style="font-size: 16px; line-height: 1.7; font-weight: 500">
                Hello ${this.state.user.name}! I've been tracking your React progress. You're doing amazing! How can I help you master your current module today?
              </p>
            </div>
          </div>
          
          <div style="padding: 40px; background: white; border-top: 1px solid var(--border); display: flex; gap: 24px; align-items: center">
             <input type="text" id="ai-input" placeholder="Ask about Hooks, Streaks, or anything..." style="flex: 1; border: 2px solid var(--border); border-radius: 20px; padding: 20px 32px; outline: none; font-family: var(--font-body); font-size: 18px; font-weight: 500; background: #F8FAFC; transition: border-color 0.2s">
             <button class="btn" id="send-ai" style="padding: 20px 48px; font-size: 18px">Send</button>
          </div>
        </div>
      </div>
    `;

    const input = el.querySelector('#ai-input') as HTMLInputElement;
    const sendBtn = el.querySelector('#send-ai');
    const messages = el.querySelector('#chat-messages')!;

    input.addEventListener('focus', () => input.style.borderColor = 'var(--primary)');
    input.addEventListener('blur', () => input.style.borderColor = 'var(--border)');

    const handleSend = () => {
      const val = input.value.trim();
      if (!val) return;
      
      const userMsg = document.createElement('div');
      userMsg.className = 'card animate-in';
      userMsg.style.alignSelf = 'flex-end';
      userMsg.style.background = 'var(--primary)';
      userMsg.style.color = 'white';
      userMsg.style.maxWidth = '70%';
      userMsg.style.padding = '32px';
      userMsg.style.borderRadius = '32px 0 32px 32px';
      userMsg.innerHTML = `<p style="font-size: 16px; line-height: 1.7; font-weight: 600">${val}</p>`;
      messages.appendChild(userMsg);
      input.value = '';
      messages.scrollTop = messages.scrollHeight;

      this.handleAIResponse(val, messages);
    };

    sendBtn?.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => e.key === 'Enter' && handleSend());
  }

  private renderSchedule(el: HTMLElement) {
    el.innerHTML = `
      <header style="display: flex; align-items: center; gap: 24px; margin-bottom: 56px">
        <button class="btn btn-secondary" style="padding: 14px 28px" id="schedule-back">← Dashboard</button>
        <h1>Study Schedule</h1>
      </header>
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 48px">
        <section class="card" style="padding: 40px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px">
            <h3>Weekly Planner</h3>
            <button class="btn" id="manage-plan-btn" style="padding: 12px 24px; font-size: 14px">Manage Plan</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px">
            ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
              const isActive = ['Monday', 'Wednesday', 'Friday'].includes(day);
              return `
                <div class="schedule-day" data-day="${day}" style="display: flex; align-items: center; gap: 32px; padding: 24px; border: 2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}; border-radius: 20px; background: ${isActive ? 'var(--primary-light)' : 'white'}; transition: transform 0.2s">
                  <div style="width: 120px; font-weight: 900; font-size: 18px; color: ${isActive ? 'var(--primary)' : 'var(--text-main)'}">${day}</div>
                  <div style="flex: 1; font-size: 15px; color: var(--text-muted); font-weight: 600" class="day-text">
                    ${isActive ? 'React Deep Dive · 2 Modules · 8 PM' : 'Rest or Optional Review'}
                  </div>
                  <div class="day-badge" style="display: ${isActive ? 'block' : 'none'}">
                    <span style="font-size: 12px; background: var(--primary); color: white; padding: 6px 12px; border-radius: 12px; font-weight: 900; letter-spacing: 0.05em">FOCUS DAY</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>
        
        <aside>
          <div class="card" style="background: white; border-radius: 24px; padding: 32px; border-left: 8px solid var(--accent)">
            <h3>Quick Reminders</h3>
            <div style="margin-top: 32px; display: flex; flex-direction: column; gap: 24px">
              <div style="display: flex; gap: 16px; align-items: flex-start">
                <div style="font-size: 28px">🔔</div>
                <div>
                  <div style="font-weight: 900; font-size: 16px; margin-bottom: 4px">Daily Review</div>
                  <p style="font-size: 13px; color: var(--text-muted); font-weight: 600; line-height: 1.5">You have a quiz scheduled for 8 PM tonight. Good luck!</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    `;

    el.querySelector('#schedule-back')?.addEventListener('click', () => this.navigate('dashboard'));

    let isManaging = false;
    const manageBtn = el.querySelector('#manage-plan-btn') as HTMLElement;
    const dayCards = el.querySelectorAll('.schedule-day');

    manageBtn?.addEventListener('click', () => {
      isManaging = !isManaging;
      manageBtn.innerText = isManaging ? 'Save Changes' : 'Manage Plan';
      manageBtn.style.background = isManaging ? 'var(--accent)' : 'var(--primary)';
      
      dayCards.forEach(card => {
        (card as HTMLElement).style.cursor = isManaging ? 'pointer' : 'default';
      });

      if (!isManaging) {
        alert('Your new study plan has been saved! 📅');
      }
    });

    dayCards.forEach(card => {
      card.addEventListener('click', () => {
        if (!isManaging) return;
        
        const cardEl = card as HTMLElement;
        const isActive = cardEl.style.borderColor === 'var(--primary)';
        const badge = cardEl.querySelector('.day-badge') as HTMLElement;
        const text = cardEl.querySelector('.day-text') as HTMLElement;
        const dayName = cardEl.querySelector('div:first-child') as HTMLElement;

        if (isActive) {
          cardEl.style.borderColor = 'var(--border)';
          cardEl.style.background = 'white';
          badge.style.display = 'none';
          text.innerText = 'Rest or Optional Review';
          dayName.style.color = 'var(--text-main)';
        } else {
          cardEl.style.borderColor = 'var(--primary)';
          cardEl.style.background = 'var(--primary-light)';
          badge.style.display = 'block';
          text.innerText = 'React Deep Dive · 2 Modules · 8 PM';
          dayName.style.color = 'var(--primary)';
        }
      });
    });
  }

  private renderCourseDetail(el: HTMLElement) {
    const course = this.state.courses.find(c => c.id === this.state.selectedCourseId) || this.state.courses[0];
    el.innerHTML = `
      <header style="display: flex; align-items: center; gap: 24px; margin-bottom: 56px">
        <button class="btn btn-secondary" style="padding: 14px 28px" id="detail-back">← Dashboard</button>
        <h1>${course.title}</h1>
      </header>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 56px">
        <section>
          <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 48px; border-radius: 32px">
            <div style="height: 340px; background: ${course.color}15; display: flex; align-items: center; justify-content: center; font-size: 140px">
              ${course.icon}
            </div>
            <div style="padding: 48px">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px">
                <div>
                  <div style="font-size: 12px; font-weight: 900; color: ${course.color}; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.1em">${course.category}</div>
                  <h2 style="font-size: 32px; margin-bottom: 8px; letter-spacing: -0.03em">${course.title}</h2>
                  <p style="color: var(--text-muted); font-size: 18px; font-weight: 500">Master React 18 with hooks, suspense, and server components.</p>
                </div>
                <div style="text-align: right">
                  <div style="font-size: 36px; font-weight: 900; color: var(--primary)">${course.progress}%</div>
                  <div style="font-size: 12px; color: var(--text-light); font-weight: 800; letter-spacing: 0.1em">COMPLETED</div>
                </div>
              </div>
              <div style="height: 16px; background: #F1F5F9; border-radius: 8px; overflow: hidden">
                <div style="height: 100%; width: ${course.progress}%; background: ${course.color}; transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1)"></div>
              </div>
            </div>
          </div>

          <h3 style="margin-bottom: 32px">Syllabus & Modules</h3>
          <div style="display: flex; flex-direction: column; gap: 20px">
            <div class="card" style="display: flex; flex-direction: row; align-items: center; gap: 24px; padding: 24px; border-left: 8px solid #059669">
              <div style="width: 56px; height: 56px; border-radius: 16px; background: #D1FAE5; display: flex; align-items: center; justify-content: center; font-size: 28px">✅</div>
              <div style="flex: 1">
                <div style="font-weight: 900; font-size: 18px">Module 1: Setup & JSX</div>
                <div style="font-size: 14px; color: var(--text-light); font-weight: 600">12 mins · Successfully completed</div>
              </div>
              <button class="btn btn-secondary" style="padding: 12px 24px; font-size: 13px">Review</button>
            </div>
            <div class="card" style="display: flex; flex-direction: row; align-items: center; gap: 24px; padding: 24px; border-color: var(--primary); background: var(--primary-light); border-left: 8px solid var(--primary)">
              <div style="width: 56px; height: 56px; border-radius: 16px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 28px">▶️</div>
              <div style="flex: 1">
                <div style="font-weight: 900; font-size: 18px; color: var(--primary)">Module 2: Props & State</div>
                <div style="font-size: 14px; color: var(--primary-mid); font-weight: 700">24 mins · Currently up next</div>
              </div>
              <button class="btn" style="padding: 12px 32px; font-size: 15px">Start Now</button>
            </div>
          </div>
        </section>

        <aside>
          <div class="card" style="margin-bottom: 40px; border-radius: 24px; background: #F8FAFC">
            <h3 style="margin-bottom: 24px">Detailed Stats</h3>
            <div style="display: flex; flex-direction: column; gap: 20px">
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 15px">
                <span style="color: var(--text-muted)">Completed Lectures</span>
                <span>96 / 142</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 15px">
                <span style="color: var(--text-muted)">Total Learning Hours</span>
                <span>42.5 Hours</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 15px">
                <span style="color: var(--text-muted)">Your Best Streak</span>
                <span style="color: var(--accent)">🔥 12 Days</span>
              </div>
            </div>
            <hr style="margin: 32px 0; border: 0; border-top: 1px solid var(--border)">
            <button class="btn" style="width: 100%">Claim Certificate</button>
          </div>
          
          <div class="card" style="border-radius: 24px">
             <h3 style="margin-bottom: 24px">About the Instructor</h3>
             <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px">
                <div style="width: 64px; height: 64px; border-radius: 20px; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 20px">BT</div>
                <div>
                  <div style="font-weight: 900; font-size: 18px">Brad Traversy</div>
                  <div style="font-size: 13px; color: var(--text-light); font-weight: 700">Full Stack Engineer</div>
                </div>
             </div>
             <p style="font-size: 14px; color: var(--text-muted); line-height: 1.7; font-weight: 500">
               With over 10 years of experience, Brad has taught millions of developers worldwide how to build real-world applications.
             </p>
          </div>
        </aside>
      </div>
    `;

    el.querySelector('#detail-back')?.addEventListener('click', () => this.navigate('dashboard'));
  }
}

// Global instance for convenience in HTML strings
(window as any).app = new App();
