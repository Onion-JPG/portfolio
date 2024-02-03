import customtkinter
import cassiopeia
import riotAPI
import config

# The main driver for CastHelper

# Configuring the theme
customtkinter.set_appearance_mode("dark")
customtkinter.set_default_color_theme("dark-blue")


class searchFrame(customtkinter.CTkFrame):
    def __init__(self, master):
        super().__init__(master)

        master.title("CastHelperV2 - Search")
        
        label = customtkinter.CTkLabel(master=self, text="Summoner Search", font=("Roboto", 24))
        label.grid(row=0, column=0, padx=10, pady=12)
        
        self.summonerId = customtkinter.CTkEntry(self, placeholder_text="Summoner Name")
        self.summonerId.grid(row=1, column=0, padx=10, pady=12)

        searchButton = customtkinter.CTkButton(master=self, text="Search for Game", command=self.search)
        searchButton.grid(row=3, column=0, padx=10, pady=12)

        self.console = customtkinter.CTkTextbox(master=self, state="disabled", height=5)
        self.console.grid(row=4, column=0, padx=10, pady=12)

    def search(self):
        global summoner

        name = self.summonerId.get()

        apiKey = config.apikey

        cassiopeia.set_riot_api_key(apiKey)
        summoner = cassiopeia.get_summoner(name=name, region="NA")

        if (summoner.exists): 
            # print("exist")
            if (summoner.current_match.exists):  
                # print("exist in game")          
                self.destroy()
                resultFrame(self.master).pack()
            else:
                # print("exist out of game")
                self.console.configure(state="normal")
                self.console.delete("0.0", "end")
                self.console.insert("0.0", "User found, but not in a match!")
                self.console.configure(state="disable")
        else :
            # print("not found")
            self.console.configure(state="normal")
            self.console.delete("0.0", "end")
            self.console.insert("0.0", "User not found")
            self.console.configure(state="disable")
            
#################################################################################################################################            

class resultFrame(customtkinter.CTkFrame):
    def __init__(self, master):
        super().__init__(master)

        master.title("CastHelperV2 - Results")

        # making a new search button and placing it in the top middle
        # switch_frame_button = customtkinter.CTkButton(master=self, text="Search for Another", command=self.switch_frame(master))
        # switch_frame_button.grid(row=0, column=3)

        # creating a blue and red side label
        label = customtkinter.CTkLabel(master=self, text="Blue Side", font=("Roboto", 15))
        label.grid(row=0, column=0)
        label = customtkinter.CTkLabel(master=self, text="blank label", font=("Roboto", 15))
        label.grid(row=0, column=2)
        label = customtkinter.CTkLabel(master=self, text="Red Side", font=("Roboto", 15))
        label.grid(row=0, column=4)

        # calling getChamps from our riotAPI file
        riotAPI.Parsing.display(self, summoner)
        
#################################################################################################################################

class CastHelper(customtkinter.CTk):
    def __init__(self):
        super().__init__()

        self.title("CastHelperV2")
        self.geometry("1400x800")
        # self.after(0, lambda:root.state('zoomed'))

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)

        searchFrame(self).grid(row=0, column=0, padx=10, pady=12)

    

root = CastHelper()
root.mainloop()