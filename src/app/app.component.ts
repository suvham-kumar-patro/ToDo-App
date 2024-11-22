import { Component, OnInit } from '@angular/core';
import { ServiceService } from './service.service';
import { CommonModule } from '@angular/common';
import ITodo from './model/list';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  data: ITodo[] = [];            
  filteredData: ITodo[] = [];    
  newItem: string = '';         
  selectedFilter: string = 'all'; 

  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.service.getData().subscribe(
      (response) => {
        console.log('Fetched tasks:', response);
        this.data = response;
        this.filterData();  
      },
      (error) => {
        console.error('Error fetching tasks', error);
        alert('There was an issue fetching data from the server.');
      }
    );
  }

  addTodo(): void {
    if (!this.newItem.trim()) return; 
    this.service.postData({ name: this.newItem }).subscribe(
      (adding) => {
        console.log('New task added:', adding);
        this.data.push(adding); 
        this.newItem = ''; 
        this.filterData();  
      },
      (error) => {
        console.error('Error adding task', error);
        alert('There was an issue adding the task to the server.');
      }
    );
  }

  onTaskSelect(task: ITodo): void {
    const updatedStatus = !task.completed; 
    this.service.updateData({ completed: updatedStatus }, task._id).subscribe(
      (update) => {
        console.log('Task updated:', update);
        task.completed = updatedStatus; 
        this.filterData();  
      },
      (error) => {
        console.error('Error updating task', error);
        alert('There was an error updating the task');
      }
    );
  }

  onCrossSelect(_id: string): void {
    console.log(`Deleting task with ID: ${_id}`);
    this.service.deleteDatabyId(_id).subscribe(
      (deletion) => {
        console.log('Task deleted:', deletion);
        this.data = this.data.filter(item => item._id !== _id); 
        this.filterData();  
      },
      (error) => {
        console.error('Error deleting task', error);
        alert('There was an error deleting the task');
      }
    );
  }

  filterData(): void {
    if (this.selectedFilter === 'all') {
      this.filteredData = this.data;
    } else if (this.selectedFilter === 'active') {
      this.filteredData = this.data.filter(task => !task.completed); 
    } else if (this.selectedFilter === 'completed') {
      this.filteredData = this.data.filter(task => task.completed); 
    }
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.filterData(); 
  }

  taskLeft(): number {
    return this.data.filter(task => !task.completed).length;
  }
}
