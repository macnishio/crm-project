import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      await signOut({ redirect: false });
      router.push('/');
    };

    performSignOut();
  }, [router]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Signing out...
            </h2>
          </div>
        </div>
      </div>
    </Layout>
  );
}