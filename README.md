KAMG Version 1.0 01/12/2015

CONTENTS OF THIS FILE
---------------------
 * Introduction
 * Installation
 * Requirements
 * Configuration
 * Licence
 * Maintainers


INTRODUCTION
--------------
Kinship Adjacency Matrix Generator (KAMG) is a browser-based software tool for creating adjacency matrices of kinship networks. It uses family trees in the format of GEDCOM file and the records of marriages as inputs. ties. It generates adjacency matrices in the format of CSV files as outputs. It can deal with both blood relationship (based on birth) and affinity relationship (based on marriages).

It is coded in JaveScript. The present version is 1.0. 


INSTALLATION
--------------
KAMG a portable application that runs on web browsers (only IE browsers for the present version). It can be stared by opening the "index.html" file.


REQUIREMENTS
--------------
- Operating system

KAMG should be used on Windows XP and higher. It should be run on web browsers Internet Explorer 6 or higher.

- Address

Address record is in the following format:

Level 1 address + Level 2 address + Family

wherein each of the three elements is a string without space, as an example from the “address.txt” file in the data folder shows:

OakTree Rooster Xiong

Addresses are created by hand. In the case of a missing value (e.g., a level of address or the name of family is missing), the software will not able to read the piece of address where the missing value appears.

- Intermarriage record

Considering a marriage between the person A in family F1 and the person B in family F2, the intermarriage will be recorded in the following format:

Level 1 address of F1 + Level 2 address of F1 + F1 + A + Level 1 address of F2 + Level 2 address of F2 + F2 + B

Apparently, a piece of intermarriage record consists of ten elements. Each element is a string without space. All the elements should be place in one line, and an element is separated from the one before or after it by a space. The following is an example from the “marriage records.txt” file in the data folder:

Belfield Geary Murphy Murphy-3007 OakTree Rooster Wang Wang-4005

Each piece of intermarriage record should be placed in a line. Intermarriage records should be stored in a text file. 

- Missing Data

KAMG in the current version is not able to deal with missing data. Missing information in family’s address or GEDCOM files will thus lead to dysfunction of it or inaccurate outcomes. 


CONFIGURATION
--------------
KAMG uses ActiveX in the computer to read and write the local file. Users need to enable ActiveX when using it. ActiveX is disabled in Internet Explorer by default. Usually a window will pop up at the bottom of the browser when using the software. Users can click “Allow blocked content” button in the window. Then, another window will pop up, asking whether to allow turning on ActiveX control. Clicking “Yes” will turn on ActiveX control.

In the case where no pop-up window like in Figure 1 appears, below are the steps to change the way Internet Explorer handles ActiveX controls (adopted from http://windows.microsoft.com/en-IE/windows/help/genuine/ie-activex):
- 1.	Open Internet Explorer.
- 2.	Click the Tools menu, and then click Internet Options.
- 3.	On the Security tab, click the Custom level button.
- 4.	Scroll down the Security Settings list until you see ActiveX controls and plug-ins.
- 5.	For Automatic prompting for ActiveX controls, click Enable.
- 6.	Scroll down to Download signed ActiveX controls and click Enable or Prompt.
- 7.	Scroll down to Run ActiveX controls and plug-ins and click Enable or Prompt.
- 8.	Scroll down to Script ActiveX controls marked safe for scripting and click Enable or Prompt.
- 9.	Click OK, and then click OK again.


LICENCE
--------------
KAMG is based on GNU General Public License.


MAINTAINERS
--------------
Hang Xiong (email: hang.xiong@outlook.com); 
Pin Xiong (email: pinxiongcn@foxmail.com) 
