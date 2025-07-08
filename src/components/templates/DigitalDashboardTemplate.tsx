import React from 'react';
import type { ResumeData } from '@/lib/types';

// Simple progress bar for skills
const SkillBar = ({ name, level }: { name: string; level: number }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs font-semibold mb-1">
      <span>{name}</span>
      <span>{level}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${level}%` }}></div>
    </div>
  </div>
);

export function DigitalDashboardTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="min-h-screen w-full bg-[#f5f7fa] font-sans flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="col-span-1 md:col-span-1 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
            {data.about.name?.[0]}
          </div>
          <h1 className="text-2xl font-bold mb-1 text-gray-900">{data.about.name}</h1>
          <div className="text-sm text-gray-500 mb-2">{data.about.jobTitle}</div>
          <div className="text-center text-gray-700 text-sm mb-4">{data.about.summary}</div>
          <div className="flex flex-col gap-1 w-full text-xs text-gray-600">
            <span><b>Email:</b> {data.contact.email}</span>
            <span><b>Phone:</b> {data.contact.phone}</span>
            <span><b>Website:</b> {data.contact.website}</span>
          </div>
        </div>
        {/* Experience Card */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">{exp.role}</span>
                <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</span>
              </div>
              <div className="text-sm text-gray-700">{exp.company}</div>
              {exp.description && <div className="text-xs text-gray-500 mt-1">{exp.description}</div>}
            </div>
          ))}
        </div>
        {/* Skills Card */}
        <div className="col-span-1 md:col-span-1 bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Skills</h2>
          {data.skills.map((skill, i) => (
            <SkillBar key={i} name={skill.name} level={skill.level || 80} />
          ))}
        </div>
        {/* Education Card */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">{edu.degree}</span>
                <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="text-sm text-gray-700">{edu.institution}</div>
              {edu.description && <div className="text-xs text-gray-500 mt-1">{edu.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 