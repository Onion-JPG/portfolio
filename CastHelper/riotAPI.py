import cassiopeia
import customtkinter
import os
from PIL import Image

class Parsing:
    def makeView(master, participant, row, col):
        newFrame = customtkinter.CTkFrame(master=master, width=100)
        newFrame.grid(row=row, column=col, padx=10, pady=10)
        #newFrame.grid_columnconfigure((1, 2, 3), weight=1)

        nameFrame = customtkinter.CTkFrame(master=newFrame)
        nameFrame.grid(row=0, column=1, padx=1, pady=1)

        summonerLabel = customtkinter.CTkLabel(master=nameFrame, text=participant.summoner.name)
        summonerLabel.grid(row=0, column=0, padx=10, pady=10, sticky="")

        emptyLabel1 = customtkinter.CTkLabel(master=newFrame, text="\n")
        emptyLabel1.grid(row=0, column=0, padx=40, pady=0, sticky="")
        emptyLabel2 = customtkinter.CTkLabel(master=newFrame, text="\n")
        emptyLabel2.grid(row=0, column=3, padx=40, pady=0, sticky="")

        parseChamp(newFrame, participant)

    def display(masterFrame, summoner):
        row = 1
        col = 0
        for participant in summoner.current_match.blue_team.participants:
            if(row < 4):
                Parsing.makeView(masterFrame, participant, row, col)
            else:
                Parsing.makeView(masterFrame, participant, row-3, col+1)
            row += 1
        row = 1
        col = 3
        for participant in summoner.current_match.red_team.participants:
            if(row < 3):
                Parsing.makeView(masterFrame, participant, row, col)
            else:
                Parsing.makeView(masterFrame, participant, row-2, col+1)
            row += 1
    
    def getChamps(summoner):
        print(True)

def parseChamp(frame, participant):
    image_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "champion")

    frame.label = customtkinter.CTkLabel(master=frame, text=cassiopeia.get_champion(key=participant.champion, region="NA").name, font=("Roboto", 18))
    frame.label.grid(row=1, column=1)

    champ_image = customtkinter.CTkImage(Image.open(os.path.join(image_path, participant.champion.key + ".png")), size=(25, 25))
    frame.label = customtkinter.CTkLabel(master=frame, image=champ_image, text=None)
    frame.label.grid(row=2, column=1)

    spellCount = 0
    for spell in cassiopeia.get_champion(key=participant.champion, region="NA").spells :
        frame.label = customtkinter.CTkLabel(master=frame, text=spell.name, font=("Roboto", 15))
        frame.label.grid(row=3+spellCount, column=1)
        spellCount += 1
