import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaChartPie, FaChartBar, FaChartLine } from "react-icons/fa";
import { GiPieChart } from "react-icons/gi";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ffbb28", "#a28eff"];

const AdminAnalyticsChart = () => {
  const axiosSecure = useAxiosSecure();
  const [subjectData, setSubjectData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [degreeData, setDegreeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    axiosSecure.get("/all-applications")
      .then(res => {
        const data = res.data;

        // 1. Subject Category
        const subjectCount = {};
        data.forEach(app => {
          subjectCount[app.subjectCategory] = (subjectCount[app.subjectCategory] || 0) + 1;
        });
        setSubjectData(Object.entries(subjectCount).map(([name, value]) => ({ name, value })));

        // 2. Status
        const statusCount = {};
        data.forEach(app => {
          statusCount[app.status] = (statusCount[app.status] || 0) + 1;
        });
        setStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));

        // 3. Degree
        const degreeCount = {};
        data.forEach(app => {
          degreeCount[app.degree] = (degreeCount[app.degree] || 0) + 1;
        });
        setDegreeData(Object.entries(degreeCount).map(([name, value]) => ({ name, value })));

        // 4. Scholarship Category
        const categoryCount = {};
        data.forEach(app => {
          categoryCount[app.scholarshipCategory] = (categoryCount[app.scholarshipCategory] || 0) + 1;
        });
        setCategoryData(Object.entries(categoryCount).map(([name, value]) => ({ name, value })));
      })
      .catch(err => console.error(err));
  }, [axiosSecure]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-base-content flex items-center justify-center gap-2">
        <FaChartBar /> Admin Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* 1. Subject Category - Pie Chart */}
        <div className="bg-base-300 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartPie className="text-purple-500" /> Applications by Subject
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {subjectData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Status - Bar Chart */}
        <div className="bg-base-300 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartBar className="text-green-500" /> Applications by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Degree - Doughnut Chart (Pie with innerRadius) */}
        <div className="bg-base-300 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <GiPieChart className="text-yellow-600" /> Applications by Degree
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={degreeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#ffc658"
                label
              >
                {degreeData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Scholarship Category - Line Chart */}
        <div className="bg-base-300 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartLine className="text-red-500" /> Applications by Scholarship Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsChart;
