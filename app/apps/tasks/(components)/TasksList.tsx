"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Task,
  getPriorityColor,
  getPriorityIcon,
  mockTasks,
} from "@/data/tasks";
import { cn } from "@/lib/utils";
import { Calendar, Grid3X3, List, User } from "lucide-react";
import { useState } from "react";

interface TasksListProps {
  onTaskSelect: (taskId: string) => void;
}

export default function TasksList({ onTaskSelect }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleTaskToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="flex-1 p-6">
      <Tabs defaultValue="grid" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <TabsList>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Table
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Grid View */}
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  task.completed && "opacity-75"
                )}
                onClick={() => onTaskSelect(task.id)}
              >
                <CardHeader className="pb-3 w-full">
                  <div className="flex flex-col items-start justify-between w-full">
                    <div className="flex flex-col items-start gap-3 w-full">
                      <div className="flex flex-row w-full justify-between">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleTaskToggle(task.id)}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <Badge
                          className={cn(
                            "text-xs",
                            getPriorityColor(task.priority)
                          )}
                        >
                          {getPriorityIcon(task.priority)}
                          <span className="ml-1 capitalize">
                            {task.priority}
                          </span>
                        </Badge>
                      </div>

                      <CardTitle
                        className={cn(
                          "text-lg w-full ",
                          task.completed &&
                            "line-through text-gray-500 dark:text-gray-50"
                        )}
                      >
                        {task.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600  dark:text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>

                  {/* Checklist Progress */}
                  {task.checklist.length > 0 && (
                    <div className="space-y-2 ">
                      <div className="flex items-center justify-between text-xs text-gray-500  dark:text-muted-foreground">
                        <span>Checklist</span>
                        <span>
                          {
                            task.checklist.filter((item) => item.completed)
                              .length
                          }{" "}
                          / {task.checklist.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200  dark:text-muted-foreground rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              (task.checklist.filter((item) => item.completed)
                                .length /
                                task.checklist.length) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Task Metadata */}
                  <div className="flex flex-col items-start gap-4 justify-between text-xs text-gray-500  dark:text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {task.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs px-1 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {task.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{task.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table" className="mt-0">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50",
                      task.completed && "opacity-75"
                    )}
                    onClick={() => onTaskSelect(task.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div
                          className={cn(
                            "font-medium",
                            task.completed &&
                              "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          getPriorityColor(task.priority)
                        )}
                      >
                        {getPriorityIcon(task.priority)}
                        <span className="ml-1 capitalize">{task.priority}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{task.assignee}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.checklist.length > 0 ? (
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {
                              task.checklist.filter((item) => item.completed)
                                .length
                            }{" "}
                            / {task.checklist.length}
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{
                                width: `${
                                  (task.checklist.filter(
                                    (item) => item.completed
                                  ).length /
                                    task.checklist.length) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {task.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{task.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
