'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface DoctorData {
    id: string;
    name: string;
    pmdc_number: string;
    specialty: string;
    created_at: string;
    cases_completed: number;
    total_cases: number;
    has_certificate: boolean;
}

export default function AdminPage() {
    const [doctors, setDoctors] = useState<DoctorData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/doctors');
            const data = await res.json();
            if (data.doctors) {
                setDoctors(data.doctors);
            }
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
            alert("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-plum-dark">Admin Dashboard</h1>
                        <p className="text-gray-500">Track doctor participation and certification status</p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={fetchDoctors} variant="outline">Refresh Data</Button>
                        <Button onClick={handlePrint}>Print / Save PDF</Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white p-6 shadow-sm border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase">Total Registrations</p>
                        <p className="text-4xl font-bold text-plum">{doctors.length}</p>
                    </Card>
                    <Card className="bg-white p-6 shadow-sm border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase">Certificates Earned</p>
                        <p className="text-4xl font-bold text-green-600">
                            {doctors.filter(d => d.has_certificate).length}
                        </p>
                    </Card>
                    <Card className="bg-white p-6 shadow-sm border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 uppercase">Completion Rate</p>
                        <p className="text-4xl font-bold text-blue-600">
                            {doctors.length > 0 ? Math.round((doctors.filter(d => d.has_certificate).length / doctors.length) * 100) : 0}%
                        </p>
                    </Card>
                </div>

                {/* Table */}
                <Card className="bg-white shadow-md overflow-hidden border border-gray-200 rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Doctor Name</th>
                                    <th className="p-4 font-semibold">PMDC Number</th>
                                    <th className="p-4 font-semibold">Specialty</th>
                                    <th className="p-4 font-semibold">Progress</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Registered At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">Loading data...</td>
                                    </tr>
                                ) : doctors.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">No doctors registered yet.</td>
                                    </tr>
                                ) : (
                                    doctors.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900">{doc.name}</td>
                                            <td className="p-4 text-gray-600 font-mono text-sm">{doc.pmdc_number}</td>
                                            <td className="p-4 text-gray-600 badge"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{doc.specialty}</span></td>
                                            <td className="p-4 text-gray-700">
                                                {doc.cases_completed} / {doc.total_cases} Cases
                                            </td>
                                            <td className="p-4">
                                                {doc.has_certificate ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                                        Certified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                                                        In Progress
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">
                                                {new Date(doc.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
