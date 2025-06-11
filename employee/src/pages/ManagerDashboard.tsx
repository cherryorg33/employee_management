import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  LogOut,
  Plus,
  Search,
  ArrowLeft,
  ArrowRight,
  Edit,
  Trash2,
} from "lucide-react";
import { config } from "../config";
import { toast } from "sonner";

type Employee = {
  id: number;
  name: string;
  email: string;
};

const ManagerDashboard = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const employeesPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (role !== "manager") navigate("/unauthorized");
    else fetchEmployees(currentPage, search);
  }, [role, currentPage, search]);

  const fetchEmployees = async (page = 1, keyword = "") => {
    try {
      const { data } = await axios.get(`${config.BASE_URL}/api/manager/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page,
          limit: employeesPerPage,
          search: keyword,
        },
      });
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const onSubmit = async (formData: any) => {
    try {
      if (isEditing && editingId !== null) {
        await axios.put(`${config.BASE_URL}/api/manager/employees/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await axios.post(`${config.BASE_URL}/api/manager/employees`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      setDrawerOpen(false);
      reset();
      setIsEditing(false);
      setEditingId(null);
      fetchEmployees(currentPage, search);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (emp: Employee) => {
    setIsEditing(true);
    setEditingId(emp.id);
    setDrawerOpen(true);
    setValue("name", emp.name);
    setValue("email", emp.email);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${config.BASE_URL}/api/manager/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchEmployees(currentPage, search);
        toast.success('Employee deleted successfully!', {
          description: 'You can undo this action.',
          action: {
            label: 'Undo',
            onClick: () => {
              // Perform undo logic here
              console.log('Undo clicked');
            },
          },
        });
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manager Dashboard</h2>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => {
              reset();
              setIsEditing(false);
              setDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Employee
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-2 px-4 border-b">ID</th>
              <th className="text-left py-2 px-4 border-b">Name</th>
              <th className="text-left py-2 px-4 border-b">Email</th>
              <th className="text-left py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees&& employees?.map((emp:any) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{emp.id}</td>
                <td className="py-2 px-4 border-b">{emp.name}</td>
                <td className="py-2 px-4 border-b">{emp.email}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <button onClick={() => handleEdit(emp)}>
                    <Edit className="text-blue-600 hover:text-blue-800" />
                  </button>
                  <button onClick={() => handleDelete(emp.id)}>
                    <Trash2 className="text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 border rounded disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="p-2 border rounded disabled:opacity-50"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Drawer Form */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
          <div className="bg-white w-full max-w-sm p-6 h-full shadow-lg overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditing ? "Edit Employee" : "Add New Employee"}
              </h3>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setIsEditing(false);
                  reset();
                }}
                className="text-gray-500 text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: true })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!isEditing && (
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {isEditing ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
