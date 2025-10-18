'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import TicketSubmissionForm from '@/components/TicketSubmissionForm';
import TicketDetailsModal from '@/components/TicketDetailsModal';
import { TicketData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Ticket, 
  Plus, 
  Filter, 
  Search, 
  ChevronDown, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  UserCheck,
  Users,
  UserRound,
  ChevronRight,
  Trash
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Get user initials for avatar
  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': 
      case 'Developer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Finance': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Customer Service': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'General': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    // Ensure this only runs on the client side
    if (typeof window === 'undefined') return;
    
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        setLoading(false);
        return;
      }

      setUser(currentUser);
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role);
      } else {
        setUserRole('unknown');
      }

      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    // Ensure this only runs on the client side
    if (typeof window === 'undefined') return;
    if (!userRole || !user) return;

    let ticketsQuery;
    if (userRole === 'super-admin') {
      // Super admin sees all tickets
      ticketsQuery = collection(db, 'tickets');
    } else {
      // Regular users see tickets assigned to their role
      const categoryRole = userRole === 'developer' ? 'Developer' : userRole === 'customer-service' ? 'Customer Service' : 'Finance';
      ticketsQuery = query(
        collection(db, 'tickets'),
        where('assignedToRole', 'in', [categoryRole, 'developer'])
      );
    }

    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      const fetchedTickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TicketData[];
      
      // Filter tickets based on role assignment and user assignment
      let filteredTickets = fetchedTickets;
      if (userRole !== 'super-admin') {
        filteredTickets = fetchedTickets.filter((ticket) => {
          return (ticket.assignedToRole === userRole && !ticket.assignedToUser) || 
                 (ticket.assignedToUser === user.uid);
        });
      }
      
      setTickets(filteredTickets);
    });

    return () => unsubscribeTickets();
  }, [userRole, user]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleAssignTicket = async (ticketId: string, assignedToRole: string | null) => {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, { assignedToRole: assignedToRole });
  };

  const handleAssignToUser = async (ticketId: string, assignedToUser: string | null) => {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, { assignedToUser: assignedToUser });
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const response = await fetch('/api/delete-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      // The ticket will be automatically removed from the UI due to the real-time listener
    } catch (error) {
      console.error('Error deleting ticket:', error);
      // You might want to show a toast or alert here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || userRole === 'unknown') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
            <CardDescription>
              You are not authorized to view this page. Please log in with a valid user role.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={handleSignOut} variant="destructive" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Hello, {user?.email}!</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              
              {/* Expandable Create Ticket Button - Only for authorized users */}
              {(userRole === 'super-admin' || userRole === 'developer') && (
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Ticket
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 ml-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-2" />
                    )}
                  </Button>

                  {isExpanded && (
                    <div className="absolute top-full right-0 mt-2 w-96 z-50">
                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Plus className="w-5 h-5 mr-2" />
                            Create Ticket
                          </CardTitle>
                          <CardDescription>
                            Submit a new support ticket
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <TicketSubmissionForm />
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                        {user?.email ? getUserInitials(user.email) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900">{user?.email}</p>
                      <p className="text-xs text-slate-500 capitalize">{userRole}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Full width layout since sidebar is now in header */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Tickets</p>
                    <p className="text-2xl font-bold text-slate-900">{tickets.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {userRole === 'super-admin' ? 'Unassigned' : 'Open Tickets'}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userRole === 'super-admin' 
                        ? tickets.filter(t => !t.assignedToRole).length
                        : tickets.filter(t => t.assignedToRole === userRole && !t.assignedToUser).length
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {userRole === 'super-admin' ? 'Role Assigned' : 'My Tickets'}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userRole === 'super-admin'
                        ? tickets.filter(t => t.assignedToRole && !t.assignedToUser).length
                        : tickets.filter(t => t.assignedToUser === user?.uid).length
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {userRole === 'super-admin' ? 'User Assigned' : 'Resolved'}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {userRole === 'super-admin'
                        ? tickets.filter(t => t.assignedToUser).length
                        : tickets.filter(t => t.status === 'Resolved').length
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Available Tickets</CardTitle>
                  <CardDescription>
                    {userRole === 'super-admin' 
                      ? 'All tickets in the system' 
                      : `Tickets for ${userRole} role`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <Card 
                      key={ticket.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-black-500"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className={getCategoryColor(ticket.category)}>
                                {ticket.category}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(ticket.status || 'Open')}>
                                {ticket.status || 'New'}
                              </Badge>
                              {ticket.assignedToRole && (
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                  <Users className="w-3 h-3 mr-1" />
                                  {ticket.assignedToRole}
                                </Badge>
                              )}
                              {ticket.assignedToUser && (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                  <UserIcon className="w-3 h-3 mr-1" />
                                  Assigned to Me
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">Issue #{ticket.id.slice(0, 8)}</h4>
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{ticket.issue}</p>
                            <div className="flex items-center text-xs text-slate-500 space-x-4">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {ticket.createdAt ? new Date(ticket.createdAt.seconds * 1000).toLocaleString() : 'Unknown'}
                              </span>
                              <span className="flex items-center">
                                <UserRound className="w-3 h-3 mr-1" />
                                {userRole === 'super-admin' 
                                  ? `Role: ${ticket.assignedToRole || 'Unassigned'} | User: ${ticket.assignedToUser ? 'Assigned' : 'Available'}`
                                  : `Status: ${ticket.assignedToUser === user?.uid ? 'Assigned to Me' : 'Available'}`
                                }
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {/* Super Admin Controls */}
                            {userRole === 'super-admin' && (
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTicket(ticket.id);
                                  }}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                                {!ticket.assignedToRole && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                                        <Users className="w-4 h-4 mr-2" />
                                        Assign Role
                                        <ChevronDown className="w-4 h-4 ml-1" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Assign to Role</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      {['developer', 'customer-service', 'finance'].map(role => (
                                        <DropdownMenuItem 
                                          key={role}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAssignTicket(ticket.id, role);
                                          }}
                                        >
                                          {role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                                
                                {ticket.assignedToUser && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAssignToUser(ticket.id, null);
                                    }}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    Unassign User
                                  </Button>
                                )}
                                
                                {ticket.assignedToRole && !ticket.assignedToUser && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAssignTicket(ticket.id, null);
                                    }}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    Unassign Role
                                  </Button>
                                )}
                              </div>
                            )}
                            
                            {/* Self-Assignment for Regular Users */}
                            {userRole !== 'super-admin' && ticket.assignedToRole === userRole && !ticket.assignedToUser && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignToUser(ticket.id, user.uid);
                                }}
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Assign to Me
                              </Button>
                            )}
                            
                            {/* Unassign from self for regular users */}
                            {userRole !== 'super-admin' && ticket.assignedToUser === user?.uid && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignToUser(ticket.id, null);
                                }}
                                className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Release Ticket
                              </Button>
                            )}
                            
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No tickets available for your role. Tickets will appear here when they are assigned to {userRole} users.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}