%%{init: {'theme': 'neutral', 'themeVariables': { 'primaryColor': '#FFD700', 'edgeLabelBackground':'#FFF5E6'}}}%%
graph LR
subgraph 用户界面
A[Login组件] -->|"① 用户点击登录<br>🖱️📝"| B(dispatch(login(formData)))
end

subgraph Redux Action层
B --> C{auth/actions.ts}
C -->|"② 发起登录请求<br>📨"| D["loginRequest()"]
D -->|"③ 显示Loading状态<br>⏳"| E[Reducer]
C -->|"④ 调用API<br>🌐"| F[[API服务器]]
F -->|"⑤ 返回数据<br>✅/❌"| C
C -->|成功| G["loginSuccess(user)"]
C -->|失败| H["loginFailure(error)"]
end

subgraph Redux状态管理
E -->|"⑥ 处理action<br>⚙️"| I[auth/reducer.ts]
I -->|"⑦ 更新状态<br>🔄"| J[[Redux Store]]
end

subgraph React响应
J -->|"⑧ 通知订阅者<br>🔔"| K[useAuth Hook]
K -->|"⑨ 返回新状态<br>📊"| A
end

A -->|已登录| L["⑩ 显示欢迎界面<br>👋 Welcome {user}!"]
A -->|失败| M["⑪ 显示错误提示<br>❌ {error}"]
A -->|加载中| N["⑫ 显示Loading...<br>⏳"]

style A fill:#E1F5FE,stroke:#039BE5
style C fill:#FFECB3,stroke:#FFA000
style I fill:#C8E6C9,stroke#388E3C
style J fill:#F3E5F5,stroke:#8E24AA
style K fill:#E0F7FA,stroke:#00ACC1