#  Gamified Quiz Application Angular


### Technical Landscape
- **Supabase Advantages**:
  - PostgreSQL triggers for point calculation
  - Row-Level Security for RBAC implementation
- **Angular Architecture**:
  - Observable pattern for state management
  - PrimeNG vs Tailwind design tradeoffs

### Commercial Solutions
- Comparison with Kahoot!, Quizlet (feature matrix included in Appendix A)

## 3. System Design & Implementation

### Architectural Overview
```mermaid
graph TD
    A[Angular Frontend] -->|HTTP| B[Supabase API]
    B --> C[(PostgreSQL DB)]
    C --> D[Triggers]
    D --> E[Points Calculation]
```

### Optimisation 
- Lazy Loading modules i.e students, teacher, admin
- angular Query for state management
- observable pattern for consuming API
- signals for better reactivity
![image](https://github.com/user-attachments/assets/d3c02b25-0e34-457d-9adc-13b71810cfd5)
![image](https://github.com/user-attachments/assets/72c1f8f0-1a7a-4196-8f15-69a35936eb38)
![image](https://github.com/user-attachments/assets/6dcac69f-c26e-4de6-a47c-f24375c0a8c4)
![image](https://github.com/user-attachments/assets/4328fe1f-ad50-48bc-9f3b-e2bc6fe802c8)
![image](https://github.com/user-attachments/assets/705cffce-0e0a-4f60-9553-22c6ba6254a9)
![image](https://github.com/user-attachments/assets/43ecf938-4e8b-453c-9e3f-a280b1f8803a)
![image](https://github.com/user-attachments/assets/b56ae2d5-877b-4da9-b108-3fa3a1208cef)
![image](https://github.com/user-attachments/assets/cce13565-76a4-4086-918e-3a655421af0c)
![image](https://github.com/user-attachments/assets/f2378347-98f6-4740-8878-3f6660765c68)
![image](https://github.com/user-attachments/assets/7c643ff6-c963-4e1e-94c5-4bd6514b96c0)










