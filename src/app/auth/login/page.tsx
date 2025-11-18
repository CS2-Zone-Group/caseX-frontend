'use client';

export default function LoginPage() {
  const handleSteamLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    window.location.href = `${apiUrl}/auth/steam`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          CaseX ga kirish
        </h1>
        
        <button
          onClick={handleSteamLogin}
          className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
        >
          <span>Steam orqali kirish</span>
        </button>

        <p className="text-sm text-gray-500 text-center mt-6">
          Steam orqali kirib, CS2 skinlarini xarid qiling
        </p>
      </div>
    </div>
  );
}
