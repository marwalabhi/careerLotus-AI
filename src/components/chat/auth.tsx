<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome - Your Career Guide</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
            font-family: 'Inter', sans-serif;
        }

        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .soft-gradient {
            background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .hover-scale {
            transition: transform 0.2s ease-in-out;
        }

        .hover-scale:hover {
            transform: scale(1.02);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
        }

        .fade-in-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-in-delay-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-in-delay-3 { animation-delay: 0.3s; opacity: 0; }

        input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
    </style>
</head>
<body class="soft-gradient min-h-screen">
    <div class="min-h-screen flex flex-col lg:flex-row">
        <!-- Left Side - Hero Section -->
        <div class="gradient-bg text-white p-8 lg:p-12 flex-1 flex flex-col justify-center relative overflow-hidden">
            <!-- Decorative circles -->
            <div class="absolute top-20 left-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 opacity-10 rounded-full blur-3xl"></div>

            <div class="relative z-10 max-w-xl mx-auto lg:mx-0">
                <!-- Logo Placeholder -->
                <div class="fade-in mb-8">
                    <div class="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center shimmer">
                        <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                        </svg>
                    </div>
                </div>

                <!-- Hero Content -->
                <h1 class="text-4xl lg:text-5xl font-bold mb-4 fade-in fade-in-delay-1">
                    Welcome to Your Career Journey
                </h1>
                <p class="text-xl lg:text-2xl mb-2 opacity-95 fade-in fade-in-delay-2">
                    Your career guide, powered by AI
                </p>
                <p class="text-lg opacity-80 mb-8 fade-in fade-in-delay-3">
                    Get personalized career advice, skill recommendations, and job market insights tailored just for you.
                </p>

                <!-- Get Started Button (Mobile) -->
                <div class="lg:hidden fade-in fade-in-delay-3">
                    <button onclick="scrollToForm()" class="bg-white text-purple-700 px-8 py-4 rounded-xl font-semibold text-lg hover-scale shadow-xl">
                        Get Started →
                    </button>
                </div>

                <!-- Features -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 fade-in fade-in-delay-3">
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-sm">AI-Powered Insights</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-sm">Personalized Advice</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span class="text-sm">24/7 Available</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side - Login Form -->
        <div id="loginForm" class="flex-1 flex items-center justify-center p-8 lg:p-12">
            <div class="w-full max-w-md">
                <div class="glass-effect rounded-2xl shadow-2xl p-8 fade-in">
                    <!-- Tab Navigation -->
                    <div class="flex space-x-1 mb-8 p-1 bg-gray-100 rounded-lg">
                        <button onclick="switchTab('login')" id="loginTab" class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 bg-white text-gray-900 shadow">
                            Sign In
                        </button>
                        <button onclick="switchTab('signup')" id="signupTab" class="flex-1 py-2 px-4 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200">
                            Sign Up
                        </button>
                    </div>

                    <!-- Login Form -->
                    <div id="loginContent">
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p class="text-gray-600 mb-6">Enter your credentials to continue</p>

                        <form onsubmit="handleLogin(event)">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input type="email" required placeholder="you@example.com"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 transition-colors">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input type="password" required placeholder="••••••••"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 transition-colors">
                                </div>

                                <div class="flex items-center justify-between">
                                    <label class="flex items-center">
                                        <input type="checkbox" class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                                        <span class="ml-2 text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <a href="#" class="text-sm text-purple-600 hover:text-purple-700 font-medium">Forgot password?</a>
                                </div>
                            </div>

                            <button type="submit" class="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover-scale shadow-lg">
                                Sign In
                            </button>
                        </form>
                    </div>

                    <!-- Signup Form (Hidden by default) -->
                    <div id="signupContent" style="display: none;">
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">Create account</h2>
                        <p class="text-gray-600 mb-6">Start your career journey today</p>

                        <form onsubmit="handleSignup(event)">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input type="text" required placeholder="John Doe"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 transition-colors">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input type="email" required placeholder="you@example.com"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 transition-colors">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input type="password" required placeholder="••••••••"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 transition-colors">
                                </div>

                                <div class="flex items-center">
                                    <input type="checkbox" required class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                                    <span class="ml-2 text-sm text-gray-600">I agree to the <a href="#" class="text-purple-600 hover:text-purple-700">Terms and Conditions</a></span>
                                </div>
                            </div>

                            <button type="submit" class="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover-scale shadow-lg">
                                Create Account
                            </button>
                        </form>
                    </div>

                    <!-- Divider -->
                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    <!-- Guest Option -->
                    <button onclick="continueAsGuest()" class="w-full py-3 px-4 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors hover-scale">
                        Continue as Guest
                    </button>

                    <!-- Social Login Options -->
                    <div class="mt-4 grid grid-cols-2 gap-3">
                        <button class="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span class="text-sm font-medium">Google</span>
                        </button>
                        <button class="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span class="text-sm font-medium">GitHub</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Tab switching
        function switchTab(tab) {
            const loginTab = document.getElementById('loginTab');
            const signupTab = document.getElementById('signupTab');
            const loginContent = document.getElementById('loginContent');
            const signupContent = document.getElementById('signupContent');

            if (tab === 'login') {
                loginTab.classList.add('bg-white', 'text-gray-900', 'shadow');
                loginTab.classList.remove('text-gray-600');
                signupTab.classList.remove('bg-white', 'text-gray-900', 'shadow');
                signupTab.classList.add('text-gray-600');
                loginContent.style.display = 'block';
                signupContent.style.display = 'none';
            } else {
                signupTab.classList.add('bg-white', 'text-gray-900', 'shadow');
                signupTab.classList.remove('text-gray-600');
                loginTab.classList.remove('bg-white', 'text-gray-900', 'shadow');
                loginTab.classList.add('text-gray-600');
                loginContent.style.display = 'none';
                signupContent.style.display = 'block';
            }
        }

        // Handle login
        function handleLogin(event) {
            event.preventDefault();
            console.log('Login submitted');
            // In a real app, this would redirect to /dashboard
            alert('Login successful! Redirecting to dashboard...');
            // window.location.href = '/dashboard';
        }

        // Handle signup
        function handleSignup(event) {
            event.preventDefault();
            console.log('Signup submitted');
            // In a real app, this would create account and redirect
            alert('Account created! Redirecting to dashboard...');
            // window.location.href = '/dashboard';
        }

        // Continue as guest
        function continueAsGuest() {
            console.log('Continuing as guest');
            // In a real app, this would redirect to /dashboard with guest session
            alert('Continuing as guest! Redirecting to dashboard...');
            // window.location.href = '/dashboard?guest=true';
        }

        // Scroll to form (mobile)
        function scrollToForm() {
            document.getElementById('loginForm').scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>
