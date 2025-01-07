import React from 'react';
import { Treemap } from './components/Treemap';

const data = {
  name: "Company Structure",
  children: [
    {
      name: "Technology",
      children: [
        {
          name: "Engineering",
          children: [
            {
              name: "Software",
              children: [
                { name: "Frontend", value: 100 },
                { name: "Backend", value: 90 },
                { name: "Mobile", value: 80 },
                { name: "DevOps", value: 70 }
              ]
            },
            {
              name: "Hardware",
              children: [
                { name: "Embedded", value: 60 },
                { name: "IoT", value: 50 },
                { name: "Robotics", value: 40 }
              ]
            }
          ]
        },
        {
          name: "Product",
          children: [
            {
              name: "Design",
              children: [
                { name: "UX", value: 85 },
                { name: "UI", value: 75 },
                { name: "Research", value: 65 }
              ]
            },
            {
              name: "Management",
              children: [
                { name: "Strategy", value: 55 },
                { name: "Analytics", value: 45 }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Operations",
      children: [
        {
          name: "Finance",
          children: [
            {
              name: "Accounting",
              children: [
                { name: "Payroll", value: 95 },
                { name: "Audit", value: 85 },
                { name: "Tax", value: 75 }
              ]
            },
            {
              name: "Investment",
              children: [
                { name: "Trading", value: 65 },
                { name: "Analysis", value: 55 }
              ]
            }
          ]
        },
        {
          name: "HR",
          children: [
            {
              name: "Recruitment",
              children: [
                { name: "Technical", value: 45 },
                { name: "Non-Tech", value: 35 }
              ]
            },
            {
              name: "Development",
              children: [
                { name: "Training", value: 25 },
                { name: "Culture", value: 15 }
              ]
            }
          ]
        }
      ]
    }
  ]
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Company Structure Visualization</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-600 mb-4">
            Click elements to select individually, or use lasso selection by clicking and dragging.
            Hover over elements to see full hierarchy path.
          </p>
          <Treemap data={data} width={1000} height={700} />
        </div>
      </div>
    </div>
  );
}

export default App;