function showForm(formType) {
    const formContainer = document.getElementById('form-container');
    const userList = document.getElementById('user-list');
    const mainMenu = document.getElementById('main-menu');

    formContainer.style.display = 'none';
    mainMenu.style.display = 'none';

    if (formType === 'addUser') {
        formContainer.innerHTML = `
            <form id="addUserForm">
                <h2>Adicionar Usuário</h2>
                <label for="employeeName" class="label">Nome:</label><br>
                <input type="text" id="employeeName" name="employeeName" class="employeeData" required><br><br>

                <label for="employeeBirthDate" class="label">Data de nascimento:</label><br>
                <input type="date" id="employeeBirthDate" name="employeeBirthDate" class="employeeData" required><br><br>

                <label for="employeeCPF" class="label">CPF do usuário:</label><br>
                <input type="text" id="employeeCPF" name="employeeCPF" class="employeeData" required maxlength="14" oninput="maskCPF(this)"><br><br>

                <label for="employeeCity" class="label">Cidade de origem:</label><br>
                <input type="text" id="employeeCity" name="employeeCity" class="employeeData" required><br><br>

                <button class="buttonDataForm" type="button" onclick="addUser()">Adicionar Usuário</button>
                <button class="buttonDataForm" type="button" onclick="goToMainMenu()">Voltar à Tela Inicial</button>
                <div id="confirmation" style="display:none; color: green;">Usuário adicionado com sucesso!</div>
            </form>
        `;
        formContainer.style.display = 'block';
    } else if (formType === 'viewUsers') {
        displayUsers();
    }
}

function goToMainMenu() {
    const formContainer = document.getElementById('form-container');
    const userList = document.getElementById('user-list');
    const mainMenu = document.getElementById('main-menu');

    formContainer.style.display = 'none';
    mainMenu.style.display = 'flex';
    userList.style.display = 'none';
}

function maskCPF(input) {
    let value = input.value.replace(/\D/g, ''); 
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

function formatDateToBrazilian(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

function formatDateFromBrazilian(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

function addUser() {
    const name = document.getElementById('employeeName').value;
    const birthDate = document.getElementById('employeeBirthDate').value;
    const cpf = document.getElementById('employeeCPF').value;
    const city = document.getElementById('employeeCity').value;

    if (name && birthDate && cpf && city) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const formattedBirthDate = formatDateToBrazilian(birthDate);
        users.push({ name: name, birthDate: formattedBirthDate, cpf: cpf, city: city });
        localStorage.setItem('users', JSON.stringify(users));

        document.getElementById('confirmation').style.display = 'block';

        document.getElementById('employeeName').value = '';
        document.getElementById('employeeBirthDate').value = '';
        document.getElementById('employeeCPF').value = '';
        document.getElementById('employeeCity').value = '';
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}

function displayUsers() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userList = document.getElementById('user-list');

    if (users.length === 0) {
        userList.innerHTML = `
        <div class=buttonsBack>
            <p class="noUsers">Nenhum usuário cadastrado.</p>
            <button class="buttonBackNoUsers" type="button" onclick="goToMainMenu()">Voltar à Tela Inicial</button>
        </div>
        `;
        userList.style.display = 'block';
        return;
    }

    let listHTML = '<h2 class="userListTitle">Lista de Usuários</h2><ul>';
    users.forEach((user, index) => {
        listHTML += `
            <div id="userListDisplayContainer">
                <li class="userListDisplay">
                    Nome: ${user.name} - Data de nascimento: ${user.birthDate} - CPF: ${user.cpf} - Cidade: ${user.city} 
                </li>
                <div id="buttonsDisplayUsers">
                    <button class="buttonDisplayUsers" onclick="editUser(${index})">Editar</button>
                    <button class="buttonDisplayUsers" onclick="deleteUser(${index})">Deletar</button>
                </div>
            </div>
        `;
    });
    listHTML += '</ul>';
    listHTML += `<button class="buttonBack" type="button" onclick="goToMainMenu()">Voltar à Tela Inicial</button>`;
    
    userList.innerHTML = listHTML;
    userList.style.display = 'block'; 
}

function editUser(index) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const newName = prompt("Edite o nome do usuário:", users[index].name);
    const newBirthDate = prompt("Edite a data de nascimento do usuário (dd/mm/aaaa):", users[index].birthDate);
    const newCPF = prompt("Edite o CPF do usuário:", users[index].cpf);
    const newCity = prompt("Edite a cidade do usuário:", users[index].city);

    if (newName && newBirthDate && newCPF && newCity) {
        users[index].name = newName;
        users[index].birthDate = newBirthDate;
        
        users[index].cpf = maskCPFOnEdit(newCPF);
        
        users[index].city = newCity;
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
    }
}

function maskCPFOnEdit(cpf) {
    let value = cpf.replace(/\D/g, ''); 
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
}


function deleteUser(index) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
    }
}
