import React from 'react'
import { Navigate } from 'react-router-dom'

/** Admin users authenticate through the same validated backend login flow. */
const AdminLogin: React.FC = () => <Navigate to="/login" replace />

export default AdminLogin
