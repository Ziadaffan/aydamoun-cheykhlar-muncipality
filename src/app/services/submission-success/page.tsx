'use client';

import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Link from 'next/link';

export default function SubmissionSuccessPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-green-50">
      <div className="mx-auto max-w-2xl p-8 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Icône de succès */}
          <div className="mb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Titre */}
          <h1 className="mb-4 text-3xl font-bold text-gray-800">تم إرسال طلبك بنجاح!</h1>

          {/* Message */}
          <p className="mb-6 text-lg text-gray-600">شكراً لك على تقديم طلبك. لقد تم استلامه وسيتم مراجعته من قبل فريق البلدية.</p>

          {/* Instructions */}
          <div className="mb-8 rounded-lg bg-yellow-50 p-6">
            <h3 className="mb-2 text-lg font-semibold text-yellow-800">الخطوات التالية</h3>
            <ul className="space-y-1 text-right text-sm text-yellow-700">
              <li>• سيتم مراجعة طلبك خلال 3-5 أيام عمل</li>
              <li>• ستتلقى إشعاراً عبر الهاتف أو البريد الإلكتروني</li>
            </ul>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/services"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              العودة إلى الخدمات
            </Link>

            <Link href="/" className="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200">
              الصفحة الرئيسية
            </Link>
          </div>

          {/* Note importante */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">إذا كان لديك أي استفسار، يمكنك التواصل معنا عبر الهاتف أو البريد الإلكتروني</p>
          </div>
        </div>
      </div>
    </div>
  );
}
