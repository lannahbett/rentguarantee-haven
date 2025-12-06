import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import RoompeerNavbar from '@/components/roompeer/RoompeerNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Send, MoreVertical, User, Flag, UserMinus, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Match {
  id: string;
  matchedUser: {
    id: string;
    full_name: string;
    bio: string | null;
  };
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

const Matches = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUnmatchDialog, setShowUnmatchDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.id);
      markMessagesAsRead(selectedMatch.id);
      
      // Subscribe to new messages
      const channel = supabase
        .channel(`messages-${selectedMatch.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `match_id=eq.${selectedMatch.id}`
          },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages(prev => [...prev, newMsg]);
            if (newMsg.sender_id !== userId) {
              markMessagesAsRead(selectedMatch.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedMatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUserId(user.id);
    await fetchMatches(user.id);
    setLoading(false);
  };

  const fetchMatches = async (currentUserId: string) => {
    const { data: matchesData, error } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`);

    if (error) {
      console.error('Error fetching matches:', error);
      return;
    }

    const matchesWithProfiles: Match[] = [];

    for (const match of matchesData || []) {
      const matchedUserId = match.user1_id === currentUserId ? match.user2_id : match.user1_id;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id, full_name, bio')
        .eq('user_id', matchedUserId)
        .single();

      // Get last message
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('content, created_at')
        .eq('match_id', match.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get unread count
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('match_id', match.id)
        .neq('sender_id', currentUserId)
        .is('read_at', null);

      if (profile) {
        matchesWithProfiles.push({
          id: match.id,
          matchedUser: {
            id: profile.user_id,
            full_name: profile.full_name,
            bio: profile.bio
          },
          lastMessage: lastMsg?.content || null,
          lastMessageTime: lastMsg?.created_at || null,
          unreadCount: count || 0
        });
      }
    }

    setMatches(matchesWithProfiles);
  };

  const fetchMessages = async (matchId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const markMessagesAsRead = async (matchId: string) => {
    if (!userId) return;
    
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('match_id', matchId)
      .neq('sender_id', userId)
      .is('read_at', null);

    // Update local state
    setMatches(prev => prev.map(m => 
      m.id === matchId ? { ...m, unreadCount: 0 } : m
    ));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch || !userId) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        match_id: selectedMatch.id,
        sender_id: userId,
        content: newMessage.trim()
      });

    if (error) {
      toast.error('Failed to send message');
      return;
    }

    setNewMessage('');
    
    // Update last message in matches list
    setMatches(prev => prev.map(m => 
      m.id === selectedMatch.id 
        ? { ...m, lastMessage: newMessage.trim(), lastMessageTime: new Date().toISOString() }
        : m
    ));
  };

  const handleUnmatch = async () => {
    if (!selectedMatch) return;

    // Delete the match (messages will cascade delete)
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', selectedMatch.id);

    if (error) {
      toast.error('Failed to unmatch');
      return;
    }

    toast.success('Unmatched successfully');
    setMatches(prev => prev.filter(m => m.id !== selectedMatch.id));
    setSelectedMatch(null);
    setMessages([]);
    setShowUnmatchDialog(false);
  };

  const handleReport = () => {
    toast.info('Report submitted. Our team will review this profile.');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoompeerNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Matches List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border bg-card overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Messages</h2>
          </div>
          
          {matches.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No matches yet</p>
              <Button 
                onClick={() => navigate('/browse')} 
                className="mt-4 bg-primary hover:bg-primary/90"
              >
                Start Browsing
              </Button>
            </div>
          ) : (
            <div>
              {matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors border-b border-border ${
                    selectedMatch?.id === match.id ? 'bg-accent' : ''
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {match.matchedUser.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium text-foreground ${match.unreadCount > 0 ? 'font-bold' : ''}`}>
                        {match.matchedUser.full_name}
                      </span>
                      {match.lastMessageTime && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(match.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${match.unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                      {match.lastMessage || 'Start a conversation'}
                    </p>
                  </div>
                  {match.unreadCount > 0 && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-bold">{match.unreadCount}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content - Chat Interface */}
        <div className="hidden md:flex flex-1 flex-col bg-background">
          {selectedMatch ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {selectedMatch.matchedUser.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedMatch.matchedUser.full_name}</h3>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                      {selectedMatch.matchedUser.bio || 'No bio'}
                    </p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/profile/${selectedMatch.matchedUser.id}`)}>
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleReport}>
                      <Flag className="h-4 w-4 mr-2" />
                      Report User
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowUnmatchDialog(true)}
                      className="text-destructive"
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unmatch
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No messages yet. Say hello! 👋</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          message.sender_id === userId
                            ? 'bg-[#5A74FF] text-white rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === userId ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!newMessage.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unmatch Confirmation Dialog */}
      <AlertDialog open={showUnmatchDialog} onOpenChange={setShowUnmatchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unmatch {selectedMatch?.matchedUser.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your match and delete all messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnmatch} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Unmatch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Matches;