import './App.css'
import './index.css'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const frameworks = ["Employee", "Manager", "Developer", "Owner"]

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

import { Label } from "@/components/ui/label"
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
} from "@/components/ui/navigation-menu"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/sonner"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Navigation Menu */}
        <div className="border-b">
          <NavigationMenu className="max-w-screen-xl mx-auto px-4 py-3">
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className="font-medium">Dashboard</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Assessments</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Onboarding</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Knowledge Base</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Reports</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Main Layout */}
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-80 shrink-0">
              <div className="border rounded-lg bg-card p-4 space-y-6 sticky top-6">
                {/* User Profile */}
                <div className="text-center space-y-2">
                  <Avatar className="mx-auto h-16 w-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold">Sarah Chen</div>
                    <div className="text-xs text-muted-foreground">Technical Lead</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs">View Profile</Button>
                </div>

                <Separator />

                {/* Role Selection */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">Role</div>
                  <Combobox items={frameworks}>
                    <ComboboxInput placeholder="Select role" />
                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                <Separator />

                {/* Navigation Links */}
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-sm">Dashboard</Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">My Assessments</Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">Team Progress</Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">Documentation</Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">Code Sandbox</Button>
                </div>

                <Separator />

                {/* Quick Stats */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">Quick Stats</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>In Progress:</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-semibold">92%</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Recent Activity */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">Recent Activity</div>
                  <div className="space-y-2 text-xs">
                    <div>✓ Assessment completed - 2h ago</div>
                    <div>📄 Doc uploaded - 5h ago</div>
                    <div>💻 Code submitted - yesterday</div>
                  </div>
                </div>

                <Separator />

                {/* Bottom Buttons */}
                <div className="space-y-2 pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">Settings</Button>
                  <Button variant="outline" size="sm" className="w-full text-xs">Help</Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Knowledge Layer Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Layer</CardTitle>
                    <CardDescription>Deterministic checks & MCQs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Assess understanding of proprietary internal architecture.</p>
                    <div className="mt-4">
                      <Label>Sample Question</Label>
                      <InputGroup className="mt-1">
                        <InputGroupInput placeholder="Enter your answer..." />
                      </InputGroup>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="default" size="sm">Start Assessment</Button>
                  </CardFooter>
                </Card>

                {/* Judgment Layer Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Judgment Layer</CardTitle>
                    <CardDescription>Scenario-based debugging</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Test response to simulated production issues.</p>
                    <div className="mt-4">
                      <Label>Select Scenario</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a scenario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="api-failure">API Failure Response</SelectItem>
                          <SelectItem value="security-breach">Security Breach Protocol</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">Simulate</Button>
                  </CardFooter>
                </Card>

                {/* Execution Layer Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Execution Layer</CardTitle>
                    <CardDescription>Real-world coding tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Fix or build features using corporate boilerplate.</p>
                    <div className="mt-4">
                      <Label>Code Editor</Label>
                      <Textarea 
                        placeholder="Write your solution here..."
                        className="font-mono text-sm mt-1 h-24"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="default" size="sm">Submit Solution</Button>
                  </CardFooter>
                </Card>
              </div>

              {/* RAG Pipeline Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Proprietary Knowledge Ingestion (RAG Pipeline)</CardTitle>
                  <CardDescription>Upload internal documentation or connect GitHub repositories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputGroup>
                    <InputGroupInput placeholder="GitHub Repository URL" />
                    <InputGroupButton>
                      <Button variant="secondary">Connect</Button>
                    </InputGroupButton>
                  </InputGroup>
                  <div>
                    <Label>Document Upload</Label>
                    <InputGroup className="mt-1">
                      <InputGroupInput type="file" accept=".pdf,.md" />
                    </InputGroup>
                  </div>
                  <div>
                    <Label>Processing Status</Label>
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                  </div>
                </CardContent>
                <CardFooter>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Vectorize Options</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Chunking Strategy</DropdownMenuLabel>
                        <DropdownMenuItem>Semantic</DropdownMenuItem>
                        <DropdownMenuItem>Fixed Size</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>

              {/* Split-Screen Interface */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Internal Documentation Access</CardTitle>
                    <CardDescription>Open-book resources</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">API Reference v2.1</p>
                      <p className="text-xs text-muted-foreground">Authentication endpoints</p>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">Architecture Specs</p>
                      <p className="text-xs text-muted-foreground">Microservices layout</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Secure Code Sandbox</CardTitle>
                    <CardDescription>Isolated execution environment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="// Write your code here in the sandbox environment"
                      className="font-mono text-sm h-32"
                    />
                    <div className="mt-4 flex justify-end">
                      <Button variant="default" size="sm">Run Tests</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Toaster position="bottom-right" />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default App