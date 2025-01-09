import React from "react";
import { Treemap } from "./components/Treemap";

const data = {
  name: "2023",
  children: [
    {
      name: "Q1",
      children: [
        {
          name: "January",
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
                        { name: "DevOps", value: 70 },
                      ],
                    },
                    {
                      name: "Hardware",
                      children: [
                        { name: "Embedded", value: 60 },
                        { name: "IoT", value: 50 },
                        { name: "Robotics", value: 40 },
                      ],
                    },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    {
                      name: "Design",
                      children: [
                        { name: "UX", value: 85 },
                        { name: "UI", value: 75 },
                        { name: "Research", value: 65 },
                      ],
                    },
                    {
                      name: "Management",
                      children: [
                        { name: "Strategy", value: 55 },
                        { name: "Analytics", value: 45 },
                      ],
                    },
                  ],
                },
              ],
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
                        { name: "Tax", value: 75 },
                      ],
                    },
                    {
                      name: "Investment",
                      children: [
                        { name: "Trading", value: 65 },
                        { name: "Analysis", value: 55 },
                      ],
                    },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 45 },
                        { name: "Non-Tech", value: 35 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 25 },
                        { name: "Culture", value: 15 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          name: "February",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 55 },
                    { name: "Backend", value: 65 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 35 },
                    { name: "Management", value: 45 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 25 },
                    { name: "Budgeting", value: 30 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 50 },
                        { name: "Non-Tech", value: 40 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 30 },
                        { name: "Culture", value: 20 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "March",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 60 },
                    { name: "Backend", value: 70 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 40 },
                    { name: "Management", value: 50 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 30 },
                    { name: "Budgeting", value: 35 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 55 },
                        { name: "Non-Tech", value: 45 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 35 },
                        { name: "Culture", value: 25 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Q2",
      children: [
        {
          name: "April",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 65 },
                    { name: "Backend", value: 75 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 45 },
                    { name: "Management", value: 55 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 35 },
                    { name: "Budgeting", value: 40 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 60 },
                        { name: "Non-Tech", value: 50 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 40 },
                        { name: "Culture", value: 30 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "May",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 70 },
                    { name: "Backend", value: 80 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 50 },
                    { name: "Management", value: 60 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 40 },
                    { name: "Budgeting", value: 45 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 65 },
                        { name: "Non-Tech", value: 55 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 45 },
                        { name: "Culture", value: 35 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "June",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 75 },
                    { name: "Backend", value: 85 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 55 },
                    { name: "Management", value: 65 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 45 },
                    { name: "Budgeting", value: 50 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 70 },
                        { name: "Non-Tech", value: 60 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 50 },
                        { name: "Culture", value: 40 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Q3",
      children: [
        {
          name: "July",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 80 },
                    { name: "Backend", value: 90 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 60 },
                    { name: "Management", value: 70 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 50 },
                    { name: "Budgeting", value: 55 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 75 },
                        { name: "Non-Tech", value: 65 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 55 },
                        { name: "Culture", value: 45 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "August",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 85 },
                    { name: "Backend", value: 95 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 65 },
                    { name: "Management", value: 75 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 55 },
                    { name: "Budgeting", value: 60 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 80 },
                        { name: "Non-Tech", value: 70 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 60 },
                        { name: "Culture", value: 50 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "September",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 90 },
                    { name: "Backend", value: 100 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 70 },
                    { name: "Management", value: 80 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 60 },
                    { name: "Budgeting", value: 65 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 85 },
                        { name: "Non-Tech", value: 75 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 65 },
                        { name: "Culture", value: 55 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Q4",
      children: [
        {
          name: "October",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 95 },
                    { name: "Backend", value: 105 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 75 },
                    { name: "Management", value: 85 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 65 },
                    { name: "Budgeting", value: 70 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 90 },
                        { name: "Non-Tech", value: 80 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 70 },
                        { name: "Culture", value: 60 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "November",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 100 },
                    { name: "Backend", value: 110 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 80 },
                    { name: "Management", value: 90 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 70 },
                    { name: "Budgeting", value: 75 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 95 },
                        { name: "Non-Tech", value: 85 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 75 },
                        { name: "Culture", value: 65 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "December",
          children: [
            {
              name: "Technology",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend", value: 105 },
                    { name: "Backend", value: 115 },
                  ],
                },
                {
                  name: "Product",
                  children: [
                    { name: "Design", value: 85 },
                    { name: "Management", value: 95 },
                  ],
                },
              ],
            },
            {
              name: "Operations",
              children: [
                {
                  name: "Finance",
                  children: [
                    { name: "Accounting", value: 75 },
                    { name: "Budgeting", value: 80 },
                  ],
                },
                {
                  name: "HR",
                  children: [
                    {
                      name: "Recruitment",
                      children: [
                        { name: "Technical", value: 100 },
                        { name: "Non-Tech", value: 90 },
                      ],
                    },
                    {
                      name: "Development",
                      children: [
                        { name: "Training", value: 80 },
                        { name: "Culture", value: 70 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],  
};

function App() {
  return <Treemap data={data} width={2000} height={1400} />;
}

export default App;
