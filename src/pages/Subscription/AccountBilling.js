import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BackButton from '../../components/BackButton';

/**
 * AccountBilling component for managing subscription billing details
 */
const AccountBilling = () => {
  const { user } = useAuth();

  return (
    <div className="account-billing-page container mx-auto px-4 py-6">
      <div className="mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Billing & Subscription</h1>
      </div>
      
      {user ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="current-plan-section mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Plan</h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Free Plan
                </span>
                <p className="text-gray-600 mt-2">
                  Your plan renews on: N/A
                </p>
              </div>
              <button className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>
          
          <div className="payment-methods-section mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment Methods</h2>
            <p className="text-gray-600 mb-4">
              You don't have any payment methods on file.
            </p>
            <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors">
              Add Payment Method
            </button>
          </div>
          
          <div className="billing-history-section">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Billing History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Description</th>
                    <th className="py-3 px-6 text-right">Amount</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left" colSpan="5">
                      No billing history available.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Please sign in to view your billing information.</p>
        </div>
      )}
    </div>
  );
};

export default AccountBilling; 