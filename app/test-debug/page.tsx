"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Package } from 'lucide-react';
import { MOCK_USER } from '../../constants';
import toast from 'react-hot-toast';

export default function TestDebugPage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<string[]>([]);

  const userId = session?.user?.email || MOCK_USER.email;

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const debugProducts = async () => {
    try {
      addResult('🔍 Checking products for current user...');
      const response = await fetch(`/api/debug-products?sellerId=${encodeURIComponent(userId)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Products debug:', data);
        addResult(`✅ Found ${data.sellerProductsCount} products for ${data.sellerId}`);
        addResult(`📊 Total products: ${data.totalProductsCount}, Null sellers: ${data.nullSellerCount}`);
        addResult(`👥 All sellers: ${data.allSellers.join(', ') || 'NONE'}`);
      } else {
        addResult('❌ Failed to fetch debug info');
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const checkSpecificProduct = async () => {
    const problemProductId = '1768730198049';
    try {
      addResult(`🔍 Checking ownership of product ${problemProductId}...`);
      const response = await fetch(`/api/check-product-owner?productId=${problemProductId}&userId=${encodeURIComponent(userId)}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Product ownership check:', data);
        addResult(`📦 Product: ${data.productName}`);
        addResult(`👤 Owner: ${data.productSellerId || 'NULL'} vs User: ${data.userId}`);
        addResult(`${data.canEdit ? '✅' : '❌'} ${data.reason}`);
      } else {
        const error = await response.json();
        addResult(`❌ Check failed: ${error.message}`);
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
  };

  const checkSchema = async () => {
    try {
      addResult('🔍 Checking database schema...');
      const response = await fetch('/api/debug-schema');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Schema debug:', data);
        addResult(`📋 Columns: ${data.columnNames?.join(', ') || 'NONE'}`);
        addResult(`🔍 Sample product keys: ${data.sampleProduct ? Object.keys(data.sampleProduct).join(', ') : 'NONE'}`);
        if (data.sampleProduct) {
          addResult(`👤 sellerId: ${data.sampleProduct.sellerId || 'UNDEFINED'}`);
          addResult(`👤 sellerid: ${data.sampleProduct.sellerid || 'UNDEFINED'}`);
        }
      } else {
        addResult('❌ Failed to fetch schema info');
      }
    } catch (error) {
      addResult(`❌ Schema check error: ${error}`);
    }
  };

  const forceFixProducts = async () => {
    try {
      addResult('🚀 Force fixing specific products...');
      const response = await fetch('/api/force-fix-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Force fix result:', result);
        addResult(`✅ ${result.message}`);
        addResult(`📊 Success: ${result.summary.successful}/${result.summary.totalAttempted}`);
        
        result.updateResults.forEach((update: any) => {
          if (update.success) {
            addResult(`  ✅ ${update.name} → ${update.newSellerId}`);
          } else {
            addResult(`  ❌ ${update.name} → Failed`);
          }
        });
        
        toast.success('Products force fixed! Try deleting now.');
        setTimeout(debugProducts, 1000);
      } else {
        const error = await response.json();
        addResult(`❌ Force fix failed: ${error.message}`);
      }
    } catch (error) {
      addResult(`❌ Force fix error: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
        <h1 className="text-3xl font-bold dark:text-white mb-6 flex items-center">
          <Package className="mr-3 text-primary-600" /> Debug Tools
        </h1>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-red-800 dark:text-red-200 mb-2">🚨 Critical Issue:</h2>
          <p className="text-red-700 dark:text-red-300 text-sm">
            All products have null sellerId despite fix attempts. Use "Force Fix" to directly update the database.
          </p>
        </div>
        
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center mb-2">
            <User className="mr-2 text-primary-600" size={20} />
            <span className="font-bold dark:text-white">Current User:</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">{userId}</p>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={debugProducts}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔍 Check Products
          </button>
          <button
            onClick={checkSpecificProduct}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🚨 Check Problem Product
          </button>
          <button
            onClick={checkSchema}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📋 Check Schema
          </button>
          <button
            onClick={forceFixProducts}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🚀 Force Fix Products
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Quick Fix:</h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Click "🚀 Force Fix Products" to directly assign products 18, 19, 20, and 1768730198049 to your user.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold dark:text-white mb-4">Debug Results</h2>
          <div className="bg-zinc-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-zinc-500">Click a button to start debugging...</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}