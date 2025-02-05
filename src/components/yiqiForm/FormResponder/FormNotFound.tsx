'use client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

function FormNotFound() {
  const t = useTranslations('yiqiForm')
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6">
          <div className="text-6xl text-gray-300 mb-4">
            <i className="ri-survey-line"></i>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {t('formNotFound')}
        </h1>
        <p className="text-gray-600 mb-6">{t('brokenLinkOrDeleted')}</p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/admin"
            className="text-black p-2 rounded-lg dark:text-white 
              bg-transparent 
              hover:bg-slate-100 dark:hover:bg-slate-800 
              border border-slate-300 dark:border-slate-700 transition-colors"
          >
            {t('createNewForm')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FormNotFound
