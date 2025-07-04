// pages/index.js

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-blue-950 text-white flex flex-col items-center justify-center px-4 py-12">
      <Head>
        <title>OnChain Election System</title>
        <meta name="description" content="Secure and transparent on-chain student voting system" />
      </Head>

      {/* Logo Top Right */}
      <div className="absolute top-4 right-4">
        <Image src="/logo.png" alt="Logo" width={60} height={60} />
      </div>

      {/* Heading and Description */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">OnChain Election System</h1>
      <p className="text-lg md:text-xl text-center max-w-xl mb-8">
        A secure, transparent, and decentralized student voting platform powered by the Polygon blockchain.
      </p>

      {/* Button */}
      <button
        onClick={() => router.push('/vote')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
      >
        Start Voting
      </button>
    </div>
  );
}
