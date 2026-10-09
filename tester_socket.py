import socket
import json

def interact_with_socket(ip, port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        print(f"Conectando a {ip}:{port}...")
        s.connect((ip, port))
        print("¡Conectado exitosamente!\n")

        while True:
            print("========= MENÚ SOCKET TCP =========")
            print("1. Insertar Videojuego")
            print("2. Insertar Categoría")
            print("3. Insertar Plataforma")
            print("4. Obtener todos los Videojuegos")
            print("5. Obtener todas las Categorías")
            print("6. Obtener todas las Plataformas")
            print("7. Obtener Videojuego por ID")
            print("8. Salir")
            print("====================================")

            opcion = input("Elige una opción: ")

            if opcion == '1':
                titulo = input("Título del videojuego: ")
                precio = input("Precio: ")
                desarrollador = input("Desarrollador (Enter para omitir): ")
                anio = input("Año de lanzamiento (Enter para omitir): ")
                cat_id = input("ID de Categoría (Enter para omitir): ")
                plat_id = input("ID de Plataforma (Enter para omitir): ")

                data = {"titulo": titulo, "precio": float(precio)}
                if desarrollador: data["desarrollador"] = desarrollador
                if anio: data["anioLanzamiento"] = int(anio)
                if cat_id: data["categoriaId"] = int(cat_id)
                if plat_id: data["plataformaId"] = int(plat_id)

                comando = "{insert:" + json.dumps(data) + "}"
                s.sendall(comando.encode('utf-8'))
                respuesta = s.recv(4096).decode('utf-8')
                print(f"\n>>> Respuesta: {respuesta}")

            elif opcion == '2':
                nombre = input("Nombre de la categoría: ")
                descripcion = input("Descripción: ")
                data = {"nombre": nombre, "descripcion": descripcion}
                comando = "{insert:" + json.dumps(data) + "}"
                s.sendall(comando.encode('utf-8'))
                respuesta = s.recv(4096).decode('utf-8')
                print(f"\n>>> Respuesta: {respuesta}")

            elif opcion == '3':
                nombre = input("Nombre de la plataforma: ")
                data = {"nombre": nombre}
                comando = "{insert:" + json.dumps(data) + "}"
                s.sendall(comando.encode('utf-8'))
                respuesta = s.recv(4096).decode('utf-8')
                print(f"\n>>> Respuesta: {respuesta}")

            elif opcion == '4':
                s.sendall("{get:videojuegos}".encode('utf-8'))
                respuesta = s.recv(4096).decode('utf-8')
                print(f"\n>>> Respuesta: {respuesta}")

            elif opcion == '5':
                s.sendall("{get:categorias}".encode('utf-8'))
                respuesta = s.recv(4096).decode('utf-8')
                print(f"\n>>> Respuesta: {respuesta}")

            elif opcion == '6':
                s.sendall("{get:plataformas}".encode('utf-8'))
                respuesta = s.recv(4096).decode('utf-8')
                print(f"\n>>> Respuesta: {respuesta}")

            elif opcion == '7':
                id_vj = input("ID del videojuego: ")
                s.sendall(f"{{get:videojuegos/{id_vj}}}".encode('utf-8'))
                respuesta = s.recv(4096).decode('utf-8')
                print(f"\n>>> Respuesta: {respuesta}")

            elif opcion == '8':
                print("Cerrando conexión...")
                break
            else:
                print("Opción no válida.\n")

    except Exception as e:
        print(f"Ocurrió un error: {e}")
    finally:
        s.close()

if __name__ == "__main__":
    IP_AWS = "18.217.57.240"
    PUERTO = 6061
    interact_with_socket(IP_AWS, PUERTO)
